<template>
  <div class="analyze">
    <h1 class="analyze__title">Analyze</h1>
    <div class="analyze__upload">
      <p class="analyze__upload--label">Upload 1 kml file. [Link to <a href="https://wigle.net/uploads"
          target="_blank">WiGLE Uploads</a>]</p>
      <input class="analyze__upload--select" type="file" @change="handleFileChange" />
    </div>
    <div class="analyze__filter">
      <div class="analyze__filter--group">
        <button class="analyze__filter--group__item" @click="sortBy('timeNewest')">Newest</button>
        <button class="analyze__filter--group__item" @click="sortBy('timeOldest')">Oldest</button>
        <button class="analyze__filter--group__item" @click="sortBy('signal')">Signal</button>
        <button class="analyze__filter--group__item" @click="sortBy('type')">Type</button>
      </div>
      <div class="analyze__filter--group analyze__filter--group__nostretch">
        <input class="analyze__filter--group__item" type="text" v-model="googleMapsLink"
          placeholder="Google Maps Link" />
        <input class="analyze__filter--group__item" type="number" v-model.number="radius" placeholder="Radius in m"
          min="10" step="10" />
        <button class="analyze__filter--group__item analyze__filter--group__item__nobg" @click="resetFilters">Reset
          Filter</button>
      </div>
    </div>
    <div v-if="filteredDevices.length > 0" class="analyze__list">
      <div v-for="(device, index) in filteredDevices" :key="index"
        :class="['analyze__list--item', device.type === 'BLE' ? 'ble-device' : 'bt-device']">
        <p><strong>MAC address:</strong> {{ device.mac }}</p>
        <p><strong>Name:</strong> {{ device.name }}</p>
        <p><strong>Signal:</strong> {{ device.signal }}%</p>
        <p><strong>Type:</strong> {{ device.type }}</p>
        <p><strong>Attribute:</strong> {{ device.attributes }}</p>
        <p><strong>Date / Time:</strong> {{ device.localTime }}</p>
        <a :href="device.mapLink" target="_blank">Open in Google Maps</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const filteredDevices = ref([]);
const originaldevice = ref([]);
const googleMapsLink = ref('');
const radius = ref(1000); // radius default (m)

watch(googleMapsLink, () => filterByLocation());
watch(radius, () => filterByLocation());

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
      const placemarks = xmlDoc.getElementsByTagName("Placemark");
      const devices = Array.from(placemarks).filter(placemark => {
        const styleUrl = placemark.getElementsByTagName('styleUrl')[0]?.textContent;
        return styleUrl?.includes('bluetooth') || styleUrl?.includes('blue') || styleUrl?.includes('ltblue');
      }).map(placemark => {
        const description = placemark.getElementsByTagName('description')[0]?.textContent.trim();
        const coordinates = placemark.getElementsByTagName('coordinates')[0]?.textContent.trim().split(',');
        const mac = description.match(/Network ID: ([0-9A-F:]+)/i)?.[1] || 'Unbekannt';
        let name = placemark.getElementsByTagName('name')[0]?.textContent || '(no SSID)';
        name == '(no SSID)' ? name = 'No Name' : name = name;
        const signal = parseFloat(description.match(/Signal: (-?\d+(\.\d+)?)/)?.[1]) || 0;
        const type = description.match(/Type: (\w+)/)?.[1] || 'Unbekannt';
        const attributes = description.match(/Attributes: ([\w;]+)/)?.[1] || 'Unbekannt';
        const time = description.match(/Time: ([\d\-T:.+]+)/)?.[1] || 'Unbekannt';
        const utcDate = new Date(time);
        const isUtc7Format = time.includes('-07:00');
        if (isUtc7Format) {
          utcDate.setHours(utcDate.getHours() - 7);
        }
        const localTime = utcDate.toLocaleString('de-DE');
        const [lon, lat] = coordinates;
        return {
          mac,
          name,
          signal,
          type,
          attributes,
          localTime,
          mapLink: `https://www.google.com/maps?q=${lat},${lon}`,
          lat: parseFloat(lat),
          lon: parseFloat(lon)
        };
      });
      if (devices.length > 0) {
        const minSignal = Math.min(...devices.map(d => d.signal));
        const maxSignal = Math.max(...devices.map(d => d.signal));
        originaldevice.value = devices.map(device => {
          const signalPercent = maxSignal === minSignal ? 0 : ((device.signal - minSignal) / (maxSignal - minSignal)) * 100;
          return {
            ...device,
            signal: Math.round(signalPercent)
          };
        });
        filteredDevices.value = [...originaldevice.value];
        sortBy('timeNewest');
      } else {
        filteredDevices.value = [];
      }
    };
    reader.readAsText(file);
  }
}

function sortBy(criteria) {
  switch (criteria) {
    case 'timeNewest':
      filteredDevices.value.sort((a, b) => new Date(b.localTime) - new Date(a.localTime));
      break;
    case 'timeOldest':
      filteredDevices.value.sort((a, b) => new Date(a.localTime) - new Date(b.localTime));
      break;
    case 'signal':
      filteredDevices.value.sort((a, b) => b.signal - a.signal);
      break;
    case 'type':
      filteredDevices.value.sort((a, b) => a.type.localeCompare(b.type));
      break;
  }
}

function filterByLocation() {
  if (!googleMapsLink.value || !originaldevice.value.length) {
    filteredDevices.value = [...originaldevice.value];
    return;
  }
  const link = googleMapsLink.value;
  const radiusInMeters = radius.value;
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+),(\d+)m/;
  const match = link.match(regex);
  if (match) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    filteredDevices.value = originaldevice.value.filter(device => {
      const distance = calculateDistance(lat, lon, device.lat, device.lon);
      return distance <= radiusInMeters;
    });
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const s1 = lat1 * Math.PI / 180;
  const s2 = lat2 * Math.PI / 180;
  const p1 = (lat2 - lat1) * Math.PI / 180;
  const p2 = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(p1 / 2) * Math.sin(p1 / 2) + Math.cos(s1) * Math.cos(s2) * Math.sin(p2 / 2) * Math.sin(p2 / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function resetFilters() {
  googleMapsLink.value = '';
  radius.value = 1000;
  filteredDevices.value = [...originaldevice.value];
  sortBy('timeNewest');
}
</script>

<style lang="scss">
.analyze {
  margin: 12px;

  &__title {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 12px;
  }

  &__upload {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;

    &--label {
      margin-bottom: 6px;
    }

    &--select {
      cursor: pointer;
    }
  }

  &__filter {
    border-top: 2px solid #16423C;
    border-bottom: 2px solid #16423C;
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
    gap: 12px;

    &--group {
      display: flex;
      gap: 6px;

      &__nostretch {
        justify-content: flex-start;
        gap: 6px;
      }

      &__item {
        padding: 6px 18px;
        border-radius: 0;
        border: 2px solid #16423C;
        background: #6A9C89;
        color: #fff;
        font-size: 14px;
        cursor: pointer;

        &__nobg {
          background: #fff;
          color: #000;
          padding: 6px 8px;
        }
      }

      input {
        background: #fff;
        color: #000;
        padding: 6px 8px;
      }
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 24px 0;

    &--item {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      background-color: rgba($color: #16423C, $alpha: 0.1);
    }

    p {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      border-bottom: 1px solid #6A9C89;
    }

    strong {
      font-weight: bold;
    }
  }
}

.bt-device {
  border-left: 5px solid #00796b;
}

.ble-device {
  border-left: 5px solid #33691e;
}
</style>
