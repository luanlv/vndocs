//use with:    mongo shopluulinh --eval "var arg1=5000; arg2=1"  importCategory.js
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


var categoryLevel3 = [
    {slug: "cbus-host", name: "cBUS Host", description: "", sku: {"parent_id" : "cbus", "name" : "Category ??", "slug" : "cbus"}},
    {slug: "cbus-addon", name: "cBUS AddOn", description: "", sku: {"parent_id" : "cbus", "name" : "Category ??", "slug" : "cbus"}},

    {slug: "microcontroller", name: "Microcontroller", description: "", sku: {"parent_id" : "development-board", "name" : "Category ??", "slug" : "development-board"}},
    {slug: "arduino", name: "Arduino", description: "", sku: {"parent_id" : "development-board", "name" : "Category ??", "slug" : "development-board"}},
    {slug: "arm", name: "ARM", description: "", sku: {"parent_id" : "development-board", "name" : "Category ??", "slug" : "development-board"}},

    {slug: "orange-pi", name: "Orange Pi", description: "", sku: {"parent_id" : "embedded-system-board", "name" : "Category ??", "slug" : "embedded-system-board"}},
    {slug: "raspberry-pi", name: "Raspberry Pi", description: "", sku: {"parent_id" : "embedded-system-board", "name" : "Category ??", "slug" : "embedded-system-board"}},
    {slug: "beaglebone", name: "BeagleBone", description: "", sku: {"parent_id" : "embedded-system-board", "name" : "Category ??", "slug" : "embedded-system-board"}},

    {slug: "8051", name: "8051", description: "", sku: {"parent_id" : "programmer-debugger", "name" : "Category ??", "slug" : "programmer-debugger"}},
    {slug: "stm8", name: "STM8", description: "", sku: {"parent_id" : "programmer-debugger", "name" : "Category ??", "slug" : "programmer-debugger"}},
    {slug: "avr", name: "AVR", description: "", sku: {"parent_id" : "programmer-debugger", "name" : "Category ??", "slug" : "programmer-debugger"}},
    {slug: "pic", name: "PIC", description: "", sku: {"parent_id" : "programmer-debugger", "name" : "Category ??", "slug" : "programmer-debugger"}},
    {slug: "arm2", name: "ARM", description: "", sku: {"parent_id" : "programmer-debugger", "name" : "Category ??", "slug" : "programmer-debugger"}},
    {slug: "ti-rf-soc", name: "TI RF SoC", description: "", sku: {"parent_id" : "programmer-debugger", "name" : "Category ??", "slug" : "programmer-debugger"}},


    {slug: "dc-motor", name: "DC Motor", description: "", sku: {"parent_id" : "motor-driver", "name" : "Category ??", "slug" : "motor-driver"}},
    {slug: "stepper-motor", name: "Stepper Motor", description: "", sku: {"parent_id" : "motor-driver", "name" : "Category ??", "slug" : "motor-driver"}},

    {slug: "relay2", name: "Relay", description: "", sku: {"parent_id" : "accessory", "name" : "Category ??", "slug" : "accessory"}},
    {slug: "sd-microsd-card", name: "SD / MicroSD Card", description: "", sku: {"parent_id" : "accessory", "name" : "Category ??", "slug" : "accessory"}},
    {slug: "keypad", name: "Keypad", description: "", sku: {"parent_id" : "accessory", "name" : "Category ??", "slug" : "accessory"}},
    {slug: "memory2", name: "Memory", description: "", sku: {"parent_id" : "accessory", "name" : "Category ??", "slug" : "accessory"}},
    {slug: "audio-codec", name: "Audio/Codec", description: "", sku: {"parent_id" : "accessory", "name" : "Category ??", "slug" : "accessory"}},

    {slug: "simcom", name: "SIMCOM", description: "", sku: {"parent_id" : "gsm-gprs-gps", "name" : "Category ??", "slug" : "gsm-gprs-gps"}},
    {slug: "quectel", name: "Quectel", description: "", sku: {"parent_id" : "gsm-gprs-gps", "name" : "Category ??", "slug" : "gsm-gprs-gps"}},
    {slug: "u-blox", name: "U-BLOX", description: "", sku: {"parent_id" : "gsm-gprs-gps", "name" : "Category ??", "slug" : "gsm-gprs-gps"}},

    {slug: "rf", name: "RF", description: "", sku: {"parent_id" : "wireless", "name" : "Category ??", "slug" : "wireless"}},
    {slug: "wifi", name: "Wifi", description: "", sku: {"parent_id" : "wireless", "name" : "Category ??", "slug" : "wireless"}},
    {slug: "bluetooth", name: "Bluetooth", description: "", sku: {"parent_id" : "wireless", "name" : "Category ??", "slug" : "wireless"}},
    {slug: "rfid-nfc", name: "RFID / NFC", description: "", sku: {"parent_id" : "wireless", "name" : "Category ??", "slug" : "wireless"}},

    {slug: "msc-51", name: "MCS-51", description: "", sku: {"parent_id" : "atmel", "name" : "Category ??", "slug" : "atmel"}},
    {slug: "avr2", name: "AVR", description: "", sku: {"parent_id" : "atmel", "name" : "Category ??", "slug" : "atmel"}},

    {slug: "pic-8-bit", name: "PIC - 8 bits", description: "", sku: {"parent_id" : "microchip", "name" : "Category ??", "slug" : "microchip"}},
    {slug: "pic-16-bit", name: "PIC - 16 bits", description: "", sku: {"parent_id" : "microchip", "name" : "Category ??", "slug" : "microchip"}},

    {slug: "stm8", name: "STM8", description: "", sku: {"parent_id" : "stmicroelectronics", "name" : "Category ??", "slug" : "stmicroelectronics"}},
    {slug: "stm32", name: "STM32", description: "", sku: {"parent_id" : "stmicroelectronics", "name" : "Category ??", "slug" : "stmicroelectronics"}},

    {slug: "cortex-m0", name: "Cortex - M0", description: "", sku: {"parent_id" : "nuvoton", "name" : "Category ??", "slug" : "nuvoton"}},

    {slug: "msp430", name: "MSP430", description: "", sku: {"parent_id" : "texas-instruments", "name" : "Category ??", "slug" : "texas-instruments"}},
    {slug: "cc-soc", name: "CC - SoC", description: "", sku: {"parent_id" : "texas-instruments", "name" : "Category ??", "slug" : "texas-instruments"}},

    {slug: "anh-sang", name: "Ánh sáng", description: "", sku: {"parent_id" : "anh-sang-hong-ngoai", "name" : "Category ??", "slug" : "anh-sang-hong-ngoai"}},
    {slug: "hong-ngoai", name: "Hồng ngoại", description: "", sku: {"parent_id" : "anh-sang-hong-ngoai", "name" : "Category ??", "slug" : "anh-sang-hong-ngoai"}},

    {slug: "gia-toc", name: "Gia tốc", description: "", sku: {"parent_id" : "chuyen-dong-vi-tri", "name" : "Category ??", "slug" : "chuyen-dong-vi-tri"}},
    {slug: "pir", name: "PIR", description: "", sku: {"parent_id" : "chuyen-dong-vi-tri", "name" : "Category ??", "slug" : "chuyen-dong-vi-tri"}},
    {slug: "con-quay-hoi-chuyen", name: "Con quay hồi chuyển", description: "", sku: {"parent_id" : "chuyen-dong-vi-tri", "name" : "Category ??", "slug" : "chuyen-dong-vi-tri"}},
    {slug: "rung", name: "Rung", description: "", sku: {"parent_id" : "chuyen-dong-vi-tri", "name" : "Category ??", "slug" : "chuyen-dong-vi-tri"}},
    {slug: "cham", name: "Chạm", description: "", sku: {"parent_id" : "chuyen-dong-vi-tri", "name" : "Category ??", "slug" : "chuyen-dong-vi-tri"}},

    {slug: "nhiet-do", name: "Nhiệt độ", description: "", sku: {"parent_id" : "nhiet-do-do-am-ap-suat", "name" : "Category ??", "slug" : "nhiet-do-do-am-ap-suat"}},
    {slug: "do-am", name: "Độ ẩm", description: "", sku: {"parent_id" : "nhiet-do-do-am-ap-suat", "name" : "Category ??", "slug" : "nhiet-do-do-am-ap-suat"}},
    {slug: "ap-suat", name: "Áp suất", description: "", sku: {"parent_id" : "nhiet-do-do-am-ap-suat", "name" : "Category ??", "slug" : "nhiet-do-do-am-ap-suat"}},
    {slug: "tich-hop", name: "Tích hợp", description: "", sku: {"parent_id" : "nhiet-do-do-am-ap-suat", "name" : "Category ??", "slug" : "nhiet-do-do-am-ap-suat"}},


    {slug: "motor-controllers-driver", name: "Motor Controllers & Driver", description: "", sku: {"parent_id" : "driver-motor-control", "name" : "Category ??", "slug" : "driver-motor-control"}},
    {slug: "darlington-arrays", name: "Darlington Arrays", description: "", sku: {"parent_id" : "driver-motor-control", "name" : "Category ??", "slug" : "driver-motor-control"}},
    {slug: "led-drivers", name: "LED Drivers", description: "", sku: {"parent_id" : "driver-motor-control", "name" : "Category ??", "slug" : "driver-motor-control"}},

    {slug: "adc", name: "ADC", description: "", sku: {"parent_id" : "adc-dac", "name" : "Category ??", "slug" : "adc-dac"}},
    {slug: "dac", name: "DAC", description: "", sku: {"parent_id" : "adc-dac", "name" : "Category ??", "slug" : "adc-dac"}},

    {slug: "codec-decoder", name: "Codec / Decoder", description: "", sku: {"parent_id" : "audio", "name" : "Category ??", "slug" : "audio"}},
    {slug: "control-driver", name: "Codec / Decoder", description: "", sku: {"parent_id" : "audio", "name" : "Category ??", "slug" : "audio"}},
    {slug: "echo", name: "Echo", description: "", sku: {"parent_id" : "audio", "name" : "Category ??", "slug" : "audio"}},
    {slug: "melody", name: "Melody", description: "", sku: {"parent_id" : "audio", "name" : "Category ??", "slug" : "audio"}},
    {slug: "power-amplifier", name: "Power Amplifier", description: "", sku: {"parent_id" : "audio", "name" : "Category ??", "slug" : "audio"}},
    {slug: "rec-playback", name: "Rec / Playback", description: "", sku: {"parent_id" : "audio", "name" : "Category ??", "slug" : "audio"}},

    {slug: "40xx", name: "40xx", description: "", sku: {"parent_id" : "digital-logic", "name" : "Category ??", "slug" : "digital-logic"}},
    {slug: "74xx", name: "74xx", description: "", sku: {"parent_id" : "digital-logic", "name" : "Category ??", "slug" : "digital-logic"}},

    {slug: "can", name: "CAN", description: "", sku: {"parent_id" : "interface", "name" : "Category ??", "slug" : "interface"}},
    {slug: "ethernet", name: "Ethernet", description: "", sku: {"parent_id" : "interface", "name" : "Category ??", "slug" : "interface"}},
    {slug: "usb", name: "USB", description: "", sku: {"parent_id" : "interface", "name" : "Category ??", "slug" : "interface"}},
    {slug: "rs232-422-485", name: "RS232/422/485", description: "", sku: {"parent_id" : "interface", "name" : "Category ??", "slug" : "interface"}},
    {slug: "telephone", name: "Telephone", description: "", sku: {"parent_id" : "interface", "name" : "Category ??", "slug" : "interface"}},

    {slug: "ir", name: "IR", description: "", sku: {"parent_id" : "ir-rf-rfid-nfc", "name" : "Category ??", "slug" : "ir-rf-rfid-nfc"}},
    {slug: "rf", name: "RF", description: "", sku: {"parent_id" : "ir-rf-rfid-nfc", "name" : "Category ??", "slug" : "ir-rf-rfid-nfc"}},
    {slug: "rfid-nfc", name: "RFID / NFC", description: "", sku: {"parent_id" : "ir-rf-rfid-nfc", "name" : "Category ??", "slug" : "ir-rf-rfid-nfc"}},

    {slug: "24cxx-eeprom", name: "24Cxx Eeprom", description: "", sku: {"parent_id" : "memory", "name" : "Category ??", "slug" : "memory"}},
    {slug: "25cxx-eeprom", name: "25Cxx Eeprom", description: "", sku: {"parent_id" : "memory", "name" : "Category ??", "slug" : "memory"}},
    {slug: "93cxx-eeprom", name: "93Cxx Eeprom", description: "", sku: {"parent_id" : "memory", "name" : "Category ??", "slug" : "memory"}},
    {slug: "seria-flash", name: "Serial Flash", description: "", sku: {"parent_id" : "memory", "name" : "Category ??", "slug" : "memory"}},
    {slug: "seria-flash", name: "Serial Flash", description: "", sku: {"parent_id" : "memory", "name" : "Category ??", "slug" : "memory"}},
    {slug: "ram", name: "RAM", description: "", sku: {"parent_id" : "memory", "name" : "Category ??", "slug" : "memory"}},

    {slug: "battery-management", name: "Battery Management", description: "", sku: {"parent_id" : "power-management", "name" : "Category ??", "slug" : "power-management"}},
    {slug: "linear-regulator", name: "Linear Regulator", description: "", sku: {"parent_id" : "power-management", "name" : "Category ??", "slug" : "power-management"}},
    {slug: "switching-regulator", name: "Switching Regulator", description: "", sku: {"parent_id" : "power-management", "name" : "Category ??", "slug" : "power-management"}},
    {slug: "voltage-reference-reset", name: "Voltage Reference & Reset", description: "", sku: {"parent_id" : "power-management", "name" : "Category ??", "slug" : "power-management"}},


    {slug: "comparator", name: "Comparator", description: "", sku: {"parent_id" : "opamp-comparator", "name" : "Category ??", "slug" : "opamp-comparator"}},
    {slug: "instrumentation-amplifier", name: "Instrumentation Amplifier", description: "", sku: {"parent_id" : "opamp-comparator", "name" : "Category ??", "slug" : "opamp-comparator"}},
    {slug: "opamp", name: "OpAmp", description: "", sku: {"parent_id" : "opamp-comparator", "name" : "Category ??", "slug" : "opamp-comparator"}},
    {slug: "current-sense-amplifier", name: "Current Sense Amplifier", description: "", sku: {"parent_id" : "opamp-comparator", "name" : "Category ??", "slug" : "opamp-comparator"}},

    {slug: "digital-logic-ouput", name: "Digital / Logic Ouput", description: "", sku: {"parent_id" : "opto-photocoupler", "name" : "Category ??", "slug" : "opto-photocoupler"}},
    {slug: "transistor-output", name: "Transistor Output", description: "", sku: {"parent_id" : "opto-photocoupler", "name" : "Category ??", "slug" : "opto-photocoupler"}},
    {slug: "triac-scr-output", name: "Triac & SCR Output", description: "", sku: {"parent_id" : "opto-photocoupler", "name" : "Category ??", "slug" : "opto-photocoupler"}},

    {slug: "real-time-clock", name: "Real-Time Clock", description: "", sku: {"parent_id" : "clock-timer", "name" : "Category ??", "slug" : "clock-timer"}},
    {slug: "timer", name: "Timer", description: "", sku: {"parent_id" : "clock-timer", "name" : "Category ??", "slug" : "clock-timer"}},

    {slug: "dien-tro-smd-0603", name: "Điện trở SMD - 0603", description: "", sku: {"parent_id" : "dien-tro-bien-tro", "name" : "Category ??", "slug" : "dien-tro-bien-tro"}},
    {slug: "dien-tro-smd-0805", name: "Điện trở SMD - 0805", description: "", sku: {"parent_id" : "dien-tro-bien-tro", "name" : "Category ??", "slug" : "dien-tro-bien-tro"}},
    {slug: "bien-tro", name: "Biến trở", description: "", sku: {"parent_id" : "dien-tro-bien-tro", "name" : "Category ??", "slug" : "dien-tro-bien-tro"}},

    {slug: "tu-ceramic-smd-0805", name: "Tụ Ceramic SMD - 0805", description: "", sku: {"parent_id" : "tu-dien", "name" : "Category ??", "slug" : "tu-dien"}},
    {slug: "tu-tantalum", name: "Tụ Tantalum", description: "", sku: {"parent_id" : "tu-dien", "name" : "Category ??", "slug" : "tu-dien"}},
    {slug: "tu-nhom", name: "Tụ Nhôm", description: "", sku: {"parent_id" : "tu-dien", "name" : "Category ??", "slug" : "tu-dien"}},
    {slug: "tu-hoa", name: "Tụ Hoá", description: "", sku: {"parent_id" : "tu-dien", "name" : "Category ??", "slug" : "tu-dien"}},
    {slug: "tu-ceramic-dip", name: "Tụ Ceramic DIP", description: "", sku: {"parent_id" : "tu-dien", "name" : "Category ??", "slug" : "tu-dien"}},

    {slug: "cuon-cam-cong-suat", name: "Cuộn cảm công suất", description: "", sku: {"parent_id" : "cuon-cam", "name" : "Category ??", "slug" : "cuon-cam"}},

    {slug: "bridge", name: "Bridge", description: "", sku: {"parent_id" : "diode", "name" : "Category ??", "slug" : "diode"}},
    {slug: "rectifier", name: "Rectifier", description: "", sku: {"parent_id" : "diode", "name" : "Category ??", "slug" : "diode"}},
    {slug: "schottky", name: "Schottky", description: "", sku: {"parent_id" : "diode", "name" : "Category ??", "slug" : "diode"}},
    {slug: "zener", name: "Zener", description: "", sku: {"parent_id" : "diode", "name" : "Category ??", "slug" : "diode"}},
    {slug: "tvs", name: "TVS", description: "", sku: {"parent_id" : "diode", "name" : "Category ??", "slug" : "diode"}},

    {slug: "led-smd-0805", name: "Led SMD - 0805", description: "", sku: {"parent_id" : "led", "name" : "Category ??", "slug" : "led"}},
    {slug: "led-smd-1206", name: "Led SMD - 1206", description: "", sku: {"parent_id" : "led", "name" : "Category ??", "slug" : "led"}},
    {slug: "led-dip-3mm", name: "Led DIP - 3mm", description: "", sku: {"parent_id" : "led", "name" : "Category ??", "slug" : "led"}},
    {slug: "led-dip-5mm", name: "Led DIP - 5mm", description: "", sku: {"parent_id" : "led", "name" : "Category ??", "slug" : "led"}},
    {slug: "led-7-segment", name: "Led 7-Segment", description: "", sku: {"parent_id" : "led", "name" : "Category ??", "slug" : "led"}},
    {slug: "led-matrix", name: "Led Matrix", description: "", sku: {"parent_id" : "led", "name" : "Category ??", "slug" : "led"}},

    {slug: "dip-package", name: "DIP Package", description: "", sku: {"parent_id" : "transistor", "name" : "Category ??", "slug" : "transistor"}},
    {slug: "smd-package", name: "SMD Package", description: "", sku: {"parent_id" : "transistor", "name" : "Category ??", "slug" : "transistor"}},

    {slug: "dip-package", name: "DIP Package", description: "", sku: {"parent_id" : "fet", "name" : "Category ??", "slug" : "fet"}},
    {slug: "smd-package", name: "SMD Package", description: "", sku: {"parent_id" : "fet", "name" : "Category ??", "slug" : "fet"}},

    {slug: "triac", name: "Triac", description: "", sku: {"parent_id" : "triac-thyristor", "name" : "Category ??", "slug" : "triac-thyristor"}},
    {slug: "thyristor", name: "Thyristor", description: "", sku: {"parent_id" : "triac-thyristor", "name" : "Category ??", "slug" : "triac-thyristor"}},

    {slug: "character", name: "Character", description: "", sku: {"parent_id" : "lcd", "name" : "Category ??", "slug" : "lcd"}},
    {slug: "graphic", name: "Graphic", description: "", sku: {"parent_id" : "lcd", "name" : "Category ??", "slug" : "lcd"}},

    {slug: "05-vdc", name: "05 VDC", description: "", sku: {"parent_id" : "relay", "name" : "Category ??", "slug" : "relay"}},
    {slug: "12-vdc", name: "12 VDC", description: "", sku: {"parent_id" : "relay", "name" : "Category ??", "slug" : "relay"}},

    {slug: "dip-package", name: "DIP Package", description: "", sku: {"parent_id" : "thach-anh", "name" : "Category ??", "slug" : "thach-anh"}},
    {slug: "smd-package", name: "SMD Package", description: "", sku: {"parent_id" : "thach-anh", "name" : "Category ??", "slug" : "thach-anh"}},

    {slug: "mini-switch", name: "Mini Switch", description: "", sku: {"parent_id" : "switch-button", "name" : "Category ??", "slug" : "switch-button"}},
    {slug: "button", name: "Button", description: "", sku: {"parent_id" : "switch-button", "name" : "Category ??", "slug" : "switch-button"}},
    {slug: "dip-switch", name: "DIP Switch", description: "", sku: {"parent_id" : "switch-button", "name" : "Category ??", "slug" : "switch-button"}},
    {slug: "power-switch", name: "Power Switch", description: "", sku: {"parent_id" : "switch-button", "name" : "Category ??", "slug" : "switch-button"}},

    {slug: "rf-gsm-connector", name: "RF / GSM Connector", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "sim-card-holder", name: "SIM Card Holder", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "mmc-sd-socket", name: "MMC/SD Socket", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "usb-connector", name: "USB Connector", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "audio-video-connector", name: "Audio/Video Connector", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "rj45-rj11-ps-2-socket", name: "RJ45, RJ11, PS/2 Socket", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "pin-header-jumper", name: "Pin-header & Jumper", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "idc-socket-header", name: "IDC Socket & Header", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "power-connector", name: "Power Connector", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "d-sub-connector", name: "D-Sub Connector", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},
    {slug: "terminal-block", name: "Terminal Block", description: "", sku: {"parent_id" : "connectors-sockets", "name" : "Category ??", "slug" : "connectors-sockets"}},

    {slug: "gsm", name: "GSM", description: "", sku: {"parent_id" : "antenna", "name" : "Category ??", "slug" : "antenna"}},
    {slug: "gps", name: "GPS", description: "", sku: {"parent_id" : "antenna", "name" : "Category ??", "slug" : "antenna"}},
    {slug: "24-ghz", name: "2.4 Ghz", description: "", sku: {"parent_id" : "antenna", "name" : "Category ??", "slug" : "antenna"}},

    {slug: "rf-cable", name: "RF Cable", description: "", sku: {"parent_id" : "cable-breadboard", "name" : "Category ??", "slug" : "cable-breadboard"}},
    {slug: "header-cable", name: "Header Cable", description: "", sku: {"parent_id" : "cable-breadboard", "name" : "Category ??", "slug" : "cable-breadboard"}},
    {slug: "bread-board", name: "BreadBoard", description: "", sku: {"parent_id" : "cable-breadboard", "name" : "Category ??", "slug" : "cable-breadboard"}},
    {slug: "bread-board", name: "BreadBoard", description: "", sku: {"parent_id" : "cable-breadboard", "name" : "Category ??", "slug" : "cable-breadboard"}},

    {slug: "hop-nhom", name: "Hộp nhôm", description: "", sku: {"parent_id" : "vo-hop", "name" : "Category ??", "slug" : "vo-hop"}},
    {slug: "hop-nhua", name: "Hộp nhựa", description: "", sku: {"parent_id" : "vo-hop", "name" : "Category ??", "slug" : "vo-hop"}},

    {slug: "dung-cu", name: "Dụng cụ", description: "", sku: {"parent_id" : "dung-cu-thiet-bi", "name" : "Category ??", "slug" : "dung-cu-thiet-bi"}},
    {slug: "thiet-bi", name: "Thiết bị", description: "", sku: {"parent_id" : "dung-cu-thiet-bi", "name" : "Category ??", "slug" : "dung-cu-thiet-bi"}},

    {slug: "pin-mat-troi", name: "Pin mặt trời", description: "", sku: {"parent_id" : "pin", "name" : "Category ??", "slug" : "pin"}},
    {slug: "li-polymer", name: "Li-Polymer", description: "", sku: {"parent_id" : "pin", "name" : "Category ??", "slug" : "pin"}},
];

var categoryLevel2 = [
    {slug: "cbus", name: "cBUS", description: "", sku: {"parent_id" : "sp-phan-cung", "name" : "Category ??", "slug" : "sp-phan-cung"}},
    {slug: "development-board", name: "Development Board", description: "", sku: {"parent_id" : "sp-phan-cung", "name" : "Category ??", "slug" : "sp-phan-cung"}},
    {slug: "embedded-system-board", name: "Embedded System Board", description: "", sku: {"parent_id" : "sp-phan-cung", "name" : "Category ??", "slug" : "sp-phan-cung"}},
    {slug: "programmer-debugger", name: "Programmer / Debugger", description: "", sku: {"parent_id" : "sp-phan-cung", "name" : "Category ??", "slug" : "sp-phan-cung"}},


    {slug: "interface-converter", name: "Interface Converter", description: "", sku: {"parent_id" : "module", "name" : "Category ??", "slug" : "module"}},
    {slug: "motor-driver", name: "Motor Driver", description: "", sku: {"parent_id" : "module", "name" : "Category ??", "slug" : "module"}},
    {slug: "accessory", name: "Accessory", description: "", sku: {"parent_id" : "module", "name" : "Category ??", "slug" : "module"}},
    {slug: "gsm-gprs-gps", name: "GSM / GPRS / GPS", description: "", sku: {"parent_id" : "module", "name" : "Category ??", "slug" : "module"}},
    {slug: "wireless", name: "Wireless", description: "", sku: {"parent_id" : "module", "name" : "Category ??", "slug" : "module"}},
    {slug: "power-supply", name: "Power Supply", description: "", sku: {"parent_id" : "module", "name" : "Category ??", "slug" : "module"}},

    {slug: "atmel", name: "Atmel", description: "", sku: {"parent_id" : "vi-dieu-khien", "name" : "Category ??", "slug" : "vi-dieu-khien"}},
    {slug: "microchip", name: "Microchip", description: "", sku: {"parent_id" : "vi-dieu-khien", "name" : "Category ??", "slug" : "vi-dieu-khien"}},
    {slug: "stmicroelectronics", name: "STMicroelectronics", description: "", sku: {"parent_id" : "vi-dieu-khien", "name" : "Category ??", "slug" : "vi-dieu-khien"}},
    {slug: "nuvoton", name: "Nuvoton", description: "", sku: {"parent_id" : "vi-dieu-khien", "name" : "Category ??", "slug" : "vi-dieu-khien"}},
    {slug: "texas-instruments", name: "Texas Instruments", description: "", sku: {"parent_id" : "vi-dieu-khien", "name" : "Category ??", "slug" : "vi-dieu-khien"}},

    {slug: "anh-sang-hong-ngoai", name: "Ánh sáng / Hồng ngoại", description: "", sku: {"parent_id" : "cam-bien", "name" : "Category ??", "slug" : "cam-bien"}},
    {slug: "chuyen-dong-vi-tri", name: "Chuyển động / Vị trí", description: "", sku: {"parent_id" : "cam-bien", "name" : "Category ??", "slug" : "cam-bien"}},
    {slug: "hall-dong-dien", name: "Hall / Dòng điện", description: "", sku: {"parent_id" : "cam-bien", "name" : "Category ??", "slug" : "cam-bien"}},
    {slug: "khi", name: "Khí", description: "", sku: {"parent_id" : "cam-bien", "name" : "Category ??", "slug" : "cam-bien"}},
    {slug: "khoang-cach-sieu-am", name: "Khoảng cách / Siêu âm", description: "", sku: {"parent_id" : "cam-bien", "name" : "Category ??", "slug" : "cam-bien"}},
    {slug: "nhiet-do-do-am-ap-suat", name: "Nhiệt độ / Độ ẩm / Áp suất", description: "", sku: {"parent_id" : "cam-bien", "name" : "Category ??", "slug" : "cam-bien"}},

    {slug: "driver-motor-control", name: "Driver & Motor control", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "adc-dac", name: "ADC & DAC", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "audio", name: "Audio", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "digital-logic", name: "Digital & Logic", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "interface", name: "Interface", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "ir-rf-rfid-nfc", name: "IR / RF / RFID / NFC", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "memory", name: "Memory", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "power-management", name: "Power Management", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "opamp-comparator", name: "OpAmp & Comparator", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "opto-photocoupler", name: "Opto & Photocoupler", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},
    {slug: "clock-timer", name: "Clock & Timer", description: "", sku: {"parent_id" : "ic", "name" : "Category ??", "slug" : "ic"}},


    {slug: "dien-tro-bien-tro", name: "Điện trở & Biến trở", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "tu-dien", name: "Tụ điện", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "cuon-cam", name: "Cuộn cảm", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "diode", name: "Diode", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "led", name: "Led", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "transistor", name: "Transistor", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "fet", name: "FET", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "triac-thyristor", name: "Triac & Thyristor", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "lcd", name: "Lcd", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "relay", name: "Relay", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "thach-anh", name: "Thạch Anh", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "switch-button", name: "Switch & Button", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "connectors-sockets", name: "Connectors & Sockets", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "antenna", name: "Antenna", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},
    {slug: "buzzer", name: "Buzzer", description: "", sku: {"parent_id" : "lk-co-ban", "name" : "Category ??", "slug" : "lk-co-ban"}},

    {slug: "power-adapter", name: "Power Adapter", description: "", sku: {"parent_id" : "phu-kien-dung-cu", "name" : "Category ??", "slug" : "phu-kien-dung-cu"}},
    {slug: "cable-breadboard", name: "Cable / BreadBoard", description: "", sku: {"parent_id" : "phu-kien-dung-cu", "name" : "Category ??", "slug" : "phu-kien-dung-cu"}},
    {slug: "vo-hop", name: "Vỏ hộp", description: "", sku: {"parent_id" : "phu-kien-dung-cu", "name" : "Category ??", "slug" : "phu-kien-dung-cu"}},
    {slug: "dung-cu-thiet-bi", name: "Dụng cụ & Thiết bị", description: "", sku: {"parent_id" : "phu-kien-dung-cu", "name" : "Category ??", "slug" : "phu-kien-dung-cu"}},
    {slug: "pin", name: "Pin", description: "", sku: {"parent_id" : "phu-kien-dung-cu", "name" : "Category ??", "slug" : "phu-kien-dung-cu"}},
]


var categoryLevel1 = [
    {slug: "sp-phan-cung", name: "SẢN PHẨM PHẦN CỨNG", description: "", sku: {"parent_id" : "NONE", "name" : "Category ??", "slug" : "NONE"}},
    {slug: "module", name: "MODULE", description: "", sku: {"parent_id" : "NONE", "name" : "Category ??", "slug" : "NONE"}},
    {slug: "vi-dieu-khien", name: "VI ĐIỀU KHIỂN", description: "", sku: {"parent_id" : "NONE", "name" : "Category ??", "slug" : "NONE"}},
    {slug: "cam-bien", name: "CẢM BIẾN", description: "", sku: {"parent_id" : "NONE", "name" : "Category ??", "slug" : "NONE"}},
    {slug: "ic", name: "IC", description: "", sku: {"parent_id" : "NONE", "name" : "Category ??", "slug" : "NONE"}},
    {slug: "lk-co-ban", name: "LINH KIỆN CƠ BẢN", description: "", sku: {"parent_id" : "NONE", "name" : "Category ??", "slug" : "NONE"}},
    {slug: "phu-kien-dung-cu", name: "PHỤ KIỆN & DỤNG CỤ", description: "", sku: {"parent_id" : "NONE", "name" : "Category ??", "slug" : "NONE"}},
];

var allCategory =  categoryLevel1.concat(categoryLevel2, categoryLevel3);

Array.prototype.getItemByParam = function(paramPair) {
    var key = Object.keys(paramPair)[0];
    return this.find(function(item){return ((item[key] == paramPair[key]) ? true: false)});
}

var findUrl = function(slug){
    if(slug === "NONE") return "/c";
    var parentSlug = allCategory.getItemByParam(
        {slug: slug}
    );
    return findUrl(parentSlug.sku.slug) + '/' + slug
}


var arr1 = categoryLevel3.map(function(js){
    var url = findUrl(js.slug);
    print(url);
    return {title: js.name, http: url, parent: js.sku.slug}
});

var arr2 = categoryLevel2.map(function(js){
    var children = arr1.filter(function(value){
        return value.parent === js.slug;
    });
    if(children.length > 0) {
        return {title: js.name, http: findUrl(js.slug), parent: js.sku.slug, children: children}
    } else {
        return {title: js.name, http: findUrl(js.slug), parent: js.sku.slug}
    }
})

var arr3 = categoryLevel1.map(function(js){
    var children = arr2.filter(function(value){
        return value.parent === js.slug;
    });
    return {title: js.name, http: findUrl(js.slug), parent: js.sku.slug , children: children}
})


for(var i = 0, max = categoryLevel1.length; i< max; i++) {
    categoryLevel1[i]._id = categoryLevel1[i].slug;
    db.category.insert(categoryLevel1[i]);
}

for(var i = 0, max = categoryLevel2.length; i< max; i++) {
    categoryLevel2[i]._id = categoryLevel2[i].slug;
    db.category.insert(categoryLevel2[i]);
}

for(var i = 0, max = categoryLevel3.length; i< max; i++) {
    categoryLevel3[i]._id = categoryLevel3[i].slug;
    db.category.insert(categoryLevel3[i]);
}

db.memo_setup.insert(
    {
        "_id": "listMenu",
        "v" : arr3
    }
);

