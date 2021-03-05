let accelY = 0
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
        accelY = -1 * pins.map(
        readY,
        0,
        ADC_deadzone_low,
        DAC_resolution - 1,
        0
        )
    } else if (readY > ADC_deadzone_high) {
        accelY = pins.map(
        readY,
        ADC_deadzone_high,
        ADC_resolution - 1,
        0,
        DAC_resolution - 1
        )
    } else {
        accelY = 0
    }
    basic.pause(10)
})
