function BrakeOff () {
    time_of_last_move = input.runningTime()
    if (left_pwm != 0) {
        // Brake off
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
    if (right_pwm != 0) {
        // Brake off
        pins.digitalWritePin(DigitalPin.P15, 0)
    }
}
radio.onReceivedNumber(function (receivedNumber) {
    if (!(game.isPaused())) {
        if (receiver_mode != 0) {
            if (receivedNumber < 0) {
                reverse_left = 1
                reverse_right = 0
            } else {
                reverse_left = 0
                reverse_right = 1
            }
            left_pwm = Math.round(Math.abs(Math.trunc(receivedNumber / decimals)))
            right_pwm = Math.round(Math.abs(receivedNumber) - left_pwm * decimals)
            if (left_pwm != 0 || right_pwm != 0) {
                BrakeOff()
            }
            ledscontrol()
            led.plotBrightness(0, led_accel_row - 1, pins.map(
            left_pwm,
            0,
            DAC_resolution - 1,
            0,
            LED_max_value
            ))
            led.plotBrightness(4, led_accel_row - 1, pins.map(
            right_pwm,
            0,
            DAC_resolution - 1,
            0,
            LED_max_value
            ))
            pins.digitalWritePin(DigitalPin.P2, reverse_left)
            pins.digitalWritePin(DigitalPin.P8, reverse_right)
            pins.analogWritePin(AnalogPin.P0, left_pwm)
            pins.analogWritePin(AnalogPin.P1, right_pwm)
        }
    }
})
function setReceiverMode () {
    led.toggle(2, 0)
    if (receiver_mode == 0) {
        receiver_mode = 1
    } else {
        receiver_mode = 0
    }
}
input.onButtonPressed(Button.A, function () {
    setReceiverMode()
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
        reverse_left = 1
        accelY = Math.round(pins.map(
        readY,
        0,
        ADC_deadzone_low,
        DAC_resolution - 1,
        0
        ))
    } else if (readY > ADC_deadzone_high) {
        reverse_left = 0
        accelY = Math.round(pins.map(
        readY,
        ADC_deadzone_high,
        ADC_resolution - 1,
        0,
        DAC_resolution - 1
        ))
    } else {
        reverse_left = 0
        accelY = 0
    }
    if (accelY > 0) {
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
    } else {
        reverse_left = 0
        // rotate in place
        // 
        if (directionX < 0) {
            left_pwm = 0
            right_pwm = -1 * directionX
        } else if (directionX > 0) {
            left_pwm = directionX
            right_pwm = 0
        } else {
            left_pwm = 0
            right_pwm = 0
        }
    }
    direction_left_right_combined_number = right_pwm + left_pwm * decimals
    if (reverse_left != 0) {
        direction_left_right_combined_number = -1 * direction_left_right_combined_number
    }
    radio.sendNumber(direction_left_right_combined_number)
}
function BrakeOn () {
    pins.digitalWritePin(DigitalPin.P15, 1)
    pins.digitalWritePin(DigitalPin.P16, 1)
}
input.onButtonPressed(Button.B, function () {
    if (game.isPaused()) {
        radio.setTransmitPower(7)
        led.enable(true)
        game.resume()
    } else {
        radio.setTransmitPower(0)
        led.enable(false)
        game.pause()
    }
})
function ledscontrol () {
    led.unplot(0, led_accel_left_row)
    led.unplot(4, led_accel_right_row)
    if (reverse_left != 0) {
        led_accel_left_row = led_accel_row + 1
        led_accel_right_row = led_accel_row + 1
    } else {
        led_accel_left_row = led_accel_row - 1
        led_accel_right_row = led_accel_row - 1
    }
}
let led_accel_right_row = 0
let led_accel_left_row = 0
let direction_left_right_combined_number = 0
let accelY = 0
let readY = 0
let directionX = 0
let readX = 0
let reverse_right = 0
let reverse_left = 0
let time_of_last_move = 0
let ADC_deadzone_high = 0
let ADC_deadzone_low = 0
let LED_max_value = 0
let ADC_resolution = 0
let DAC_resolution = 0
let right_pwm = 0
let left_pwm = 0
let decimals = 0
let led_accel_row = 0
let receiver_mode = 0
radio.setGroup(99)
receiver_mode = 1
setReceiverMode()
let wait_ms_to_brake = 1000
led_accel_row = 2
led.plot(0, led_accel_row)
led.plot(4, led_accel_row)
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
    if (!(game.isPaused())) {
        if (receiver_mode == 0) {
            read_data()
            ledscontrol()
            led.plotBrightness(0, led_accel_left_row, pins.map(
            left_pwm,
            0,
            DAC_resolution - 1,
            0,
            LED_max_value
            ))
            led.plotBrightness(4, led_accel_right_row, pins.map(
            right_pwm,
            0,
            DAC_resolution - 1,
            0,
            LED_max_value
            ))
        } else {
            if (input.runningTime() - time_of_last_move > wait_ms_to_brake) {
                BrakeOn()
            }
        }
    }
    basic.pause(100)
})
