right_pwm = 0
left_pwm = 0
accelY = 0
reverse = 0
directionX = 0
readY = 0
readX = 0
DAC_resolution = 256
deadzone_width = 24
ADC_resolution = 1024
ADC_deadzone_low = ADC_resolution / 2 - deadzone_width / 2
ADC_deadzone_high = ADC_resolution / 2 + deadzone_width / 2

def on_forever():
    global readX, readY, directionX, reverse, accelY, left_pwm, right_pwm
    readX = pins.analog_read_pin(AnalogPin.P0)
    readY = pins.analog_read_pin(AnalogPin.P1)
    if readX < ADC_deadzone_low:
        directionX = -1 * pins.map(readX, 0, ADC_deadzone_low, DAC_resolution - 1, 0)
    elif readX > ADC_deadzone_high:
        directionX = pins.map(readX,
            ADC_deadzone_high,
            ADC_resolution - 1,
            0,
            DAC_resolution - 1)
    else:
        directionX = 0
    if readY < ADC_deadzone_low:
        reverse += 1
        accelY = -1 * pins.map(readY, 0, ADC_deadzone_low, DAC_resolution - 1, 0)
    elif readY > ADC_deadzone_high:
        reverse += 0
        accelY = pins.map(readY,
            ADC_deadzone_high,
            ADC_resolution - 1,
            0,
            DAC_resolution - 1)
    else:
        reverse += 0
        accelY = 0
    if directionX < 0:
        left_pwm = abs(accelY) * (1 - abs(accelY) / DAC_resolution)
        right_pwm = abs(accelY)
    elif directionX > 0:
        left_pwm = abs(accelY)
        right_pwm = abs(accelY) * (1 - abs(accelY) / DAC_resolution)
    else:
        left_pwm = abs(accelY)
        right_pwm = abs(accelY)
    led.plot_brightness(0, 2, left_pwm)
    led.plot_brightness(4, 2, right_pwm)
    basic.pause(10)
basic.forever(on_forever)
