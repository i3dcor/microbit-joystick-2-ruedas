let right_pwm = 0
let left_pwm = 0
let accelY = 0
let reverse = 0
let directionX = 0
let readY = 0
let readX = 0
let DAC_resolution = 256
let deadzone_width = 24
let ADC_resolution = 1024
let ADC_deadzone_low = ADC_resolution / 2 - deadzone_width / 2
let ADC_deadzone_high = ADC_resolution / 2 + deadzone_width / 2
basic.forever(function () {
    readX = pins.analogReadPin(AnalogPin.P0)
    readY = pins.analogReadPin(AnalogPin.P1)
    if (readX < ADC_deadzone_low) {
        directionX = -1 * pins.map(
        readX,
        0,
        ADC_deadzone_low,
        DAC_resolution - 1,
        0
        )
    } else if (readX > ADC_deadzone_high) {
        directionX = pins.map(
        readX,
        ADC_deadzone_high,
        ADC_resolution - 1,
        0,
        DAC_resolution - 1
        )
    } else {
        directionX = 0
    }
    if (readY < ADC_deadzone_low) {
        reverse += 1
        accelY = -1 * pins.map(
        readY,
        0,
        ADC_deadzone_low,
        DAC_resolution - 1,
        0
        )
    } else if (readY > ADC_deadzone_high) {
        reverse += 0
        accelY = pins.map(
        readY,
        ADC_deadzone_high,
        ADC_resolution - 1,
        0,
        DAC_resolution - 1
        )
    } else {
        reverse += 0
        accelY = 0
    }
    if (directionX < 0) {
        left_pwm = Math.abs(accelY) * (1 - Math.abs(accelY) / DAC_resolution)
        right_pwm = Math.abs(accelY)
    } else if (directionX > 0) {
        left_pwm = Math.abs(accelY)
        right_pwm = Math.abs(accelY) * (1 - Math.abs(accelY) / DAC_resolution)
    } else {
        left_pwm = Math.abs(accelY)
        right_pwm = Math.abs(accelY)
    }
    led.plotBrightness(0, 2, left_pwm)
    led.plotBrightness(4, 2, right_pwm)
    basic.pause(10)
})
