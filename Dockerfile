FROM public.ecr.aws/docker/library/node:18

# prepare ennvironment 
COPY . . 
RUN npm init --yes

# check versions 
RUN npx tsc -v 
RUN npm -v 

RUN npx tsc 
ENTRYPOINT ["node", "/app/app.js"]