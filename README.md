<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
## PlasMapper 3.0

![image](https://user-images.githubusercontent.com/68175167/161480282-edcd6f6f-f22c-4318-97a1-81f74c0c50a7.png)

This is the front-end repository for the PlasMapper 3.0 webserver.

Please see [here](http://plasmapper.wishartlab.com/) for the full site.

__Setup (development):__

After cloning the repository:
`npm install`
`npm run develop`

You may have to run this beforehand:
`npm install -g gatsby-cli`

__Setup/deployment (hosting):__

Navigate to the frontend folder inside `project`
Re-pull from this directory `git pull origin main`
Run `gatsby build`
Run `sudo systemctl restart nginx`

__Modifying textual content and Help page:__

Go to `src/config/writing.js`
Follow the instructions there
Follow the above instructions to re-deploy
