# rules
Rules processing for autodomo.

You will want to fork this repository and hack it to suit your needs.

## Examples

Rules give intelliegence to the smart home.  The kinds of things you want
to do with rules is limited only to what you can imagine.

In my case, I want:

### Bathroom
1. When the motion sensor senses activity/motion, I want to turn on the ligts.
However, if it's after 9PM, I want the lights on at 20%, which is easy
on the eyes after you've been sleeping.  During the day, I want 100%.
If there hasn't been motion after an hour, turn the lights off.

2. If the Ring doorbell sees motion at night, turn on the porch light.
Turn it off after 15 minutes.

3. When I have guests who are leaving after dark, turn on the foyer
and porch lights.  Turn them off after 15 minutes.

4. When I turn on the exaust fan in the bathroom, turn it off after 15 minutes.

5. Assure the spa heater and jets, etc., are turned off at midnight, in
case I forget.

6. Turn on the low voltage lighting in the yard and front walkway at
sunset, turn off at 2AM.

7. Start the pool pump at 9AM.  Run it for 1 hour for every 10 degrees over 40.
During the summer, it should run a couple extra hours.

etc.

## How it works

Use mqtt module for node js.  Subscribe to the topics of interest.  Do your business logic
accordingly.

So in the case of the garden lights, we would want to subscribe to the ```weather/{my_zipcode}/sunrise```
and ```weather/{my_zipcode}/sunset``` topics.  Send messages to the ``smartthings/Garden Lights/switch on/off``
to turn on/off the lights.

The intelligence itself is done via plain old JavaScript.  We have excellent tools
for developing and debugging JavaScript, why use some other invented langauge
that is likely to be deficient in functionality.  For example, the SmartThings
hub and software only has one "mode" variable to key off of.  It would
be nice to have more than one variable, like "after sunset" and "after bedtime" (which
are two distinctly different things)


