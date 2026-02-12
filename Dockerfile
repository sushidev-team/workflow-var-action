FROM node:20-alpine

LABEL "name"="Replace tokens in file"
LABEL "maintainer"="sushidev-team"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="Replace env vars in file"
LABEL "com.github.actions.description"="Replaces __TOKENS__ with environment variables in file. Handles special characters safely."
LABEL "com.github.actions.icon"="align-left"
LABEL "com.github.actions.color"="purple"

COPY index.js /action/index.js
COPY src/ /action/src/

ENTRYPOINT ["node", "/action/index.js"]
