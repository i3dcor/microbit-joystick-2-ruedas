readX = 0
readY = 0

def on_forever():
    global readX, readY
    readX = pins.analog_read_pin(AnalogPin.P0)
    readY = pins.analog_read_pin(AnalogPin.P1)
    if readX < 500:
        led.plot_brightness(0, 2, pins.map(readX, 0, 500, 255, 0))
    elif readX > 520:
        led.plot_brightness(4, 2, pins.map(readX, 520, 1023, 0, 255))
    else:
        led.plot_brightness(0, 2, 0)
        led.plot_brightness(4, 2, 0)
    if readY < 500:
        led.plot_brightness(4, 4, pins.map(readY, 0, 500, 255, 0))
    elif readY > 520:
        led.plot_brightness(4, 0, pins.map(readY, 520, 1023, 0, 255))
    else:
        led.plot_brightness(2, 0, 0)
        led.plot_brightness(2, 4, 0)
    basic.pause(10)
basic.forever(on_forever)
