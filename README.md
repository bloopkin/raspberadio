# raspberadio
Raspberry Pi Radio

# Requirements
The following should be pre-installed:
- nodejs (sudo apt-get nodejs)
- omxplayer (sudo apt-get omxplayer)

# Usage

chmod u+x start.sh
./start.sh

Open your browser with your pi url and port 1111 by default. 

You can change the port and the list of stations in radio.js by modifying the stations object on line 9. You will also have to add a corresponding entry in index.html, line 77. Future releases will allow index.html to be dynamically populated based on the js variable.
