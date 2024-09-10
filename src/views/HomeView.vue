<template>
  <div class="home">
    <h1>WELCOME!</h1>

    <h2>Potential Use Cases</h2>
    <ul>
      <li><strong>Crime Investigation:</strong> Track devices at multiple crime scenes to identify suspicious patterns.
      </li>
      <li><strong>Surveillance:</strong> Monitor devices appearing near sensitive or restricted zones.</li>
      <li><strong>Security Audits:</strong> Detect unauthorized devices during secure operations.</li>
      <li><strong>Personal Tracking:</strong> Analyze where your own devices have been detected to track their movement.
      </li>
      <li><strong>Lost Devices:</strong> Use the tool to track down lost Bluetooth devices by reviewing last-known
        locations.</li>
    </ul>

    <h2>How to Use the Tool</h2>
    <ol>
      <li>Install the Wigle app on your Android device.</li>
      <li>Create a Wigle account and log in to collect Bluetooth device data and for easy upload. You can also export the file from the app without an account.</li>
      <li>For best results, use multiple devices to collect data.</li>
      <li>Upload your collected data to Wigle, then download the KML file from: <a href="https://wigle.net/uploads"
          target="_blank">https://wigle.net/uploads</a></li>
      <li>Use the tool here to upload your KML file and analyze the devices detected.</li>
    </ol>

    <h3>Key Features:</h3>
    <ul>
      <li>Filter devices by location using Google Maps links with coordinates.</li>
      <li>Sort devices by time (newest or oldest) or by signal strength.</li>
      <li>Highlight devices appearing in multiple locations for easy identification.</li>
      <li>No data is stored on the server, ensuring privacy and security.</li>
    </ul>

    <p>For more details and to contribute, visit the GitHub repository: <a href="https://github.com/jhodevstuff"
        target="_blank">https://github.com/jhodevstuff</a></p>

    <p><em>Last updated: 2024-09-10<br>Developed by Joshua Hoffmann</em></p>
    <p><em>For future improvements or known bugs visit my GitHub repo.</em></p>
  </div>
</template>

<script setup>
</script>

<style lang="scss">
.home {
  margin: 12px;
  line-height: 1.6;
  color: #333;

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 1.5rem;
    margin-top: 30px;
    margin-bottom: 15px;
    border-bottom: 2px solid #ccc;
    padding-bottom: 5px;
  }

  h3 {
    font-size: 1.25rem;
    margin-top: 25px;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    margin-bottom: 15px;
  }

  ul,
  ol {
    margin-left: 20px;
    margin-bottom: 20px;
    padding-left: 20px;

    li {
      margin-bottom: 10px;
      line-height: 1.5;
    }

    ul {
      list-style-type: disc;
    }

    ol {
      list-style-type: decimal;
    }
  }

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  em {
    font-family: monospace;
    color: #666;
  }

  p em {
    font-size: 0.9rem;
    color: #888;
  }
}
</style>
