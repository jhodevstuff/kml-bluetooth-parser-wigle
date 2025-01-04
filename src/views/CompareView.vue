<template>
  <div class="compare">
    <h1 class="compare__title">Compare</h1>
    <div class="compare__upload">
      <p class="compare__upload--label">Upload multiple kml files. [Link to <a href="https://wigle.net/uploads"
          target="_blank">WiGLE Uploads</a>]</p>
      <input class="compare__upload--select" type="file" @change="handleFilesChange" multiple />
    </div>
    <div class="compare__filter">
      <div class="compare__filter--group">
        <button class="compare__filter--group__item" @click="sortBy('timeNewest')">Newest</button>
        <button class="compare__filter--group__item" @click="sortBy('timeOldest')">Oldest</button>
        <button class="compare__filter--group__item" @click="sortBy('signal')">Signal</button>
        <button class="compare__filter--group__item" @click="sortBy('type')">Type</button>
      </div>
    </div>
    <div v-if="filtereddevices.length > 0" class="compare__list">
      <div v-for="(device, index) in filtereddevices" :key="index"
        :class="['compare__list--item', device.type === 'BLE' ? 'ble-device' : 'bt-device']"
        :style="{ borderLeftColor: device.color }">
        <p><strong>MAC address:</strong> {{ device.mac }}</p>
        <p><strong>Name:</strong> {{ device.name }}</p>
        <p><strong>Signal:</strong> {{ device.signal }}%</p>
        <p><strong>Type:</strong> {{ device.type }}</p>
        <p><strong>Attribute:</strong> {{ device.attributes }}</p>
        <p><strong>Date / Time:</strong> {{ device.localTime }}</p>
        <p><strong>Location:</strong><a :href="device.mapLink" target="_blank">{{ device.lat }}, {{ device.lon }}</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const filtereddevices = ref([]);

function handleFilesChange(event) {
  const files = event.target.files;
  if (files.length > 0) {
    const allDevices = [];
    Array.from(files).forEach(file => {
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
            name,
            mac,
            signal,
            type,
            attributes,
            localTime,
            mapLink: `https://www.google.com/maps?q=${lat},${lon}`,
            lat: parseFloat(lat),
            lon: parseFloat(lon)
          };
        });
        allDevices.push(...devices);
        if (files[files.length - 1] === file) {
          processDevices(allDevices);
        }
      };
      reader.readAsText(file);
    });
  }
}

function processDevices(devices) {
  if (devices.length > 0) {
    const minSignal = Math.min(...devices.map(d => d.signal));
    const maxSignal = Math.max(...devices.map(d => d.signal));
    const deviceMap = new Map();
    devices.forEach(device => {
      if (!deviceMap.has(device.mac)) {
        deviceMap.set(device.mac, []);
      }
      deviceMap.get(device.mac).push(device);
    });
    const filteredDevices = [];
    const colorMap = new Map();
    deviceMap.forEach((devices, mac) => {
      if (devices.length > 1) {
        const color = getRandomColor();
        devices.forEach(device => {
          filteredDevices.push({
            ...device,
            color
          });
        });
      }
    });
    console.log('Filtered Devices:', filteredDevices);
    filtereddevices.value = filteredDevices.map(device => {
      const signalPercent = maxSignal === minSignal ? 0 : ((device.signal - minSignal) / (maxSignal - minSignal)) * 100;
      return {
        ...device,
        signal: Math.round(signalPercent)
      };
    });
  } else {
    filtereddevices.value = [];
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function sortBy(criteria) {
  switch (criteria) {
    case 'timeNewest':
      filtereddevices.value.sort((a, b) => new Date(b.localTime) - new Date(a.localTime));
      break;
    case 'timeOldest':
      filtereddevices.value.sort((a, b) => new Date(a.localTime) - new Date(b.localTime));
      break;
    case 'signal':
      filtereddevices.value.sort((a, b) => b.signal - a.signal);
      break;
    case 'type':
      filtereddevices.value.sort((a, b) => a.type.localeCompare(b.type));
      break;
  }
}
</script>

<style lang="scss">
.compare {
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
