# KML BT/BLE Analyzer

This tool helps analyze Bluetooth (BT) and Bluetooth Low Energy (BLE) devices from KML files exported via the Wigle app. It is designed for **Wigle users** to identify patterns or suspicious activity, especially through the recurring presence of devices at multiple locations. Best results are achieved when **multiple devices** collect data using Wigle logs.

## Potential Use Cases

- **Crime Investigation**:
  - Track repeated device presence across different crime scenes.
  - Identify patterns in BT/BLE device movement to uncover hidden connections.
  - Investigate suspicious devices that appear in sensitive areas (e.g., near a bank, a crime scene, or unauthorized zones).
  
- **Surveillance**:
  - Detect unusual device activity or presence near restricted zones.
  - Monitor Bluetooth devices around specific facilities (e.g., government or high-security areas).
  
- **Security Audits**:
  - Spot unauthorized devices in secure locations or during events.
  - Map device activities in high-profile zones and analyze abnormal device appearances.

- **Personal Device Tracking**:
  - Analyze your own devices to track where and when they’ve appeared.
  - Useful for finding lost Bluetooth devices by identifying their last known locations.

## How to Use the Tool

### Requirements:
- **Best results** are achieved when **multiple devices** collect Bluetooth data using the Wigle app.
- A **Wigle account** is useful for easy usage to upload and analyze your data. Otherwise you can export the kml file directly from the app.
- The tool focuses **exclusively on Bluetooth devices (BT/BLE)**.

### Steps:
1. **Collect Data**:
   - Use the Wigle app to collect Bluetooth device data on your Android device.
   - Multiple devices collecting data improves the accuracy and depth of analysis.
   - Upload the data to Wigle by logging into your account.
   
2. **Download KML File**:
   - After Wigle processes the data, download the KML file from the link: [https://wigle.net/uploads](https://wigle.net/uploads).
   
3. **Upload to KML BT/BLE Analyzer**:
   - Upload the KML file using the tool interface at [https://ijosh.de/kml](https://ijosh.de/kml).

### Features:
- **Filter by Location**: Input a Google Maps link with a pin (coordinates) and adjust the radius to find devices within the selected area.
- **Sort by Time or Signal Strength**: Organize devices by timestamp (newest/oldest first) or by signal strength.
- **Highlight Repeat Devices**: Devices that appear in multiple locations are highlighted for quick identification.
  
### Important Notes:
- This tool **does not store any data** on the server. Your data is processed and analyzed locally within your browser.
- The tool is designed for **Wigle users** who understand what they are analyzing. Misuse of data or violation of privacy laws is not encouraged.

### Links:
- GitHub: [https://github.com/jhodevstuff](https://github.com/jhodevstuff)
- Demo: [https://ijosh.de/kml](https://ijosh.de/kml)

_Last updated: 2024-09-10_
_Developed by Joshua Hoffmann_

_For future improvements or known bugs visit my GitHub repo._