const MQTT         = require('mqtt'),
      schedule     = require('node-schedule'),
      EventEmitter = require('events')

// topics we care about
const NOW    = 'weather/92211/status/now',
      LIGHTS = 'smartthings/Outdoor Lights/switch'

class Triggers extends EventEmitter {
    constructor() {
        super()
        this.sunrise = null
        this.sunset  = null
        this.lights  = null

        const client = this.client = MQTT.connect(process.env.MQTT_HOST)
        client.subscribe(NOW)
        client.subscribe(LIGHTS)

        client.on('message', (topic, message) => {
            message = message.toString()
            if (topic === NOW) {
                const weather = JSON.parse(message.toString()),
                      sunrise = new Date(weather.sunrise * 1000),
                      sunset  = new Date(weather.sunset * 1000),
                      now     = Date.now()

                if (now > sunset) {
                    if (!this.sunset) {
                        console.log('after sunset, trigger')
                        this.emit('sunset', sunset)
                    }
                }
                else if (now > sunrise) {
                    console.log('after sunrise, trigger')
                    this.emit('sunrise', sunrise)
                }

                if (this.sunset) {
                    console.log('sunset cancelled')
                    this.sunset.cancel()
                }
                this.sunset = schedule.scheduleJob(sunset, () => {
                    console.log('trigger sunset')
                    this.emit('sunset', sunset)
                })
                console.log('sunset scheduled', sunset.toLocaleString())

                if (this.sunrise) {
                    console.log('sunrise cancelled')
                    this.sunrise.cancel()
                }
                this.sunrise = schedule.scheduleJob(sunrise, () => {
                    console.log('trigger sunrise')
                    this.emit('sunrise', sunrise)
                })
                console.log('sunrise scheduled', sunrise.toLocaleString())
            }
            else {
                this.emit('lights', message)
            }
        })
    }

    publish(topic, message) {
        this.client.publish(topic, message)
    }
}

const
    triggers = new Triggers()

function outside_lights() {
    let
        lights = null

    console.log('outside_lights rule')

    triggers.on('sunset', (sunset) => {
        if (lights !== 'on') {
            console.log('sunset', 'turning ligts on')
            const timer = setInterval(() => {
                console.log('timer turning lights on')
                if (lights !== 'on') {
                    triggers.publish(LIGHTS, 'on')
                }
                else {
                    console.log('sunset', 'Lights are on')
                    clearInterval(timer)
                }
            }, 10000)
        }
        else {
            console.log('sunset', 'lights already on')
        }
    })

    triggers.on('sunrise', (sunrise) => {
        if (lights !== 'off') {
            console.log('sunrise', 'turning ligts off')
            const timer = setInterval(() => {
                console.log('timer turning lights off')
                if (lights !== 'off') {
                    triggers.publish(LIGHTS, 'off')
                }
                else {
                    console.log('sunrise', 'lights are off')
                    clearInterval(timer)
                }
            }, 10000)
        }
        else {
            console.log('sunrise', 'lights already off')
        }
    })
    triggers.on('lights', (state) => {
        lights = state
    })
}

function main() {
    outside_lights()
}

main()