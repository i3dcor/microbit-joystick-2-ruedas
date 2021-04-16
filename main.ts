radio.onReceivedNumber(function (receivedNumber) {
    if (receiver_mode != 0) {
        led.plotBrightness(0, 2, pins.map(
        left_pwm,
        0,
        DAC_resolution - 1,
        0,
        LED_max_value
        ))
        led.plotBrightness(4, 2, pins.map(
        right_pwm,
        0,
        DAC_resolution - 1,
        0,
        LED_max_value
        ))
        if (receivedNumber < 0) {
            reverse = 1
        } else {
            reverse = 0
        }
        left_pwm = Math.round(Math.abs(Math.trunc(receivedNumber / decimals)))
        right_pwm = Math.round(Math.abs(receivedNumber) - left_pwm * decimals)
        pins.analogWritePin(AnalogPin.P0, left_pwm)
        pins.analogWritePin(AnalogPin.P1, right_pwm)
        pins.digitalWritePin(DigitalPin.P2, reverse)
    }
})
input.onButtonPressed(Button.A, function () {
    led.toggle(2, 0)
    if (receiver_mode == 0) {
        receiver_mode = 1
    } else {
        receiver_mode = 0
    }
})
function read_data () {
    readX = pins.analogReadPin(AnalogPin.P0)
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
    readY = pins.analogReadPin(AnalogPin.P1)
    if (readY < ADC_deadzone_low) {
        reverse = 1
        accelY = Math.round(pins.map(
        readY,
        0,
        ADC_deadzone_low,
        DAC_resolution - 1,
        0
        ))
    } else if (readY > ADC_deadzone_high) {
        reverse = 0
        accelY = Math.round(pins.map(
        readY,
        ADC_deadzone_high,
        ADC_resolution - 1,
        0,
        DAC_resolution - 1
        ))
    } else {
        reverse = 0
        accelY = 0
    }
    if (directionX < 0) {
        left_pwm = Math.round(accelY * (1 + directionX / DAC_resolution))
        right_pwm = accelY
    } else if (directionX > 0) {
        left_pwm = accelY
        right_pwm = Math.round(accelY * (1 - directionX / DAC_resolution))
    } else {
        left_pwm = accelY
        right_pwm = accelY
    }
    direction_left_right_combined_number = right_pwm + left_pwm * decimals
    if (reverse != 0) {
        direction_left_right_combined_number = -1 * direction_left_right_combined_number
    }
    radio.sendNumber(direction_left_right_combined_number)
}
let direction_left_right_combined_number = 0
let accelY = 0
let readY = 0
let directionX = 0
let readX = 0
let reverse = 0
let ADC_deadzone_high = 0
let ADC_deadzone_low = 0
let LED_max_value = 0
let ADC_resolution = 0
let DAC_resolution = 0
let right_pwm = 0
let left_pwm = 0
let decimals = 0
let receiver_mode = 0
radio.setGroup(99)
receiver_mode = 0
decimals = 10000
left_pwm = 50
right_pwm = 50
DAC_resolution = 1024
let deadzone_width = 24
ADC_resolution = 1024
LED_max_value = 255
ADC_deadzone_low = ADC_resolution / 2 - deadzone_width / 2
ADC_deadzone_high = ADC_resolution / 2 + deadzone_width / 2
basic.forever(function () {
    if (receiver_mode == 0) {
        read_data()
        led.plotBrightness(0, 2, pins.map(
        left_pwm,
        0,
        DAC_resolution - 1,
        0,
        LED_max_value
        ))
        led.plotBrightness(4, 2, pins.map(
        right_pwm,
        0,
        DAC_resolution - 1,
        0,
        LED_max_value
        ))
        basic.pause(100)
    }
})
