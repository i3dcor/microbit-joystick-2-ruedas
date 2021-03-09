radio.onReceivedNumber(function (receivedNumber) {
    if (receiver_mode != 0) {
        basic.showNumber(receivedNumber)
        if (receivedNumber < 0) {
            reverse = 1
        } else {
            reverse = 0
        }
        left_pwm = Math.abs(Math.trunc(receivedNumber))
        right_pwm = (Math.abs(receivedNumber) - left_pwm) * 1000
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
        accelY = pins.map(
        readY,
        0,
        ADC_deadzone_low,
        DAC_resolution - 1,
        0
        )
    } else if (readY > ADC_deadzone_high) {
        reverse = 0
        accelY = pins.map(
        readY,
        ADC_deadzone_high,
        ADC_resolution - 1,
        0,
        DAC_resolution - 1
        )
    } else {
        reverse = 0
        accelY = 0
    }
    if (directionX < 0) {
        left_pwm = accelY * (1 + directionX / DAC_resolution)
        right_pwm = accelY
    } else if (directionX > 0) {
        left_pwm = accelY
        right_pwm = accelY * (1 - directionX / DAC_resolution)
    } else {
        left_pwm = accelY
        right_pwm = accelY
    }
    direction_left_right_combined_number = left_pwm + right_pwm / 1000
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
let ADC_resolution = 0
let DAC_resolution = 0
let right_pwm = 0
let left_pwm = 0
let receiver_mode = 0
radio.setGroup(99)
receiver_mode = 0
left_pwm = 50
right_pwm = 50
DAC_resolution = 256
let deadzone_width = 24
ADC_resolution = 1024
ADC_deadzone_low = ADC_resolution / 2 - deadzone_width / 2
ADC_deadzone_high = ADC_resolution / 2 + deadzone_width / 2
basic.forever(function () {
    if (receiver_mode == 0) {
        read_data()
        led.plotBrightness(0, 2, left_pwm)
        led.plotBrightness(4, 2, right_pwm)
        basic.pause(100)
    }
})
