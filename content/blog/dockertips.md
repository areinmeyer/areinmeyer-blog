---
title: Docker commands and tips I can't live without
date: "2019-07-09"
description: "Useful commands and settings for Docker development"
tags: ["docker", "tips&tricks"]
---

I have used Docker since late 2015, when I started our greenfield React/NodeJS project.  Like many developers, I tried to grok enough of it to get the project up and running.  And then as we spun off new micro-services, I copied and pasted the previous implementation to the new project.  

But over the last year, I've had to dig into the guts of Docker more and more.  This is the first part of two posts about what I've learned.  There's several comamnds or settings that I've picked up on that I think are incredibly useful.  These commands have helped increase my understanding and productivity when working with docker containers locally.

### Docker Preferences

### Save a running container as an image
```shell
docker commit container image2
```
Docker builds layers, or images for each command that you specify in the Dockerfile. This is a great way to "save" a working copy for further experimentation or other local changes.  When you run the command, the existing container and all of the changes you have made to it are stored as a new image.  This has saved me a couple of times when I started the container but maybe forgot to open a port.  

There is no clean way to open a port on a running container, and if you are trying to get something working without this command you would have to start a new container with the port open and redo any changes.  

Don't use this command to save a image that you want to publish.  The associated Dockerfile isn't updated so you would never be able to recreate the new image that you are creating.  
### Get a summary of all images/containers in Docker
```shell
docker system df
```
Want to see how much memory all of your containers and images are using?  This command gives a nice summary of the space used by images, containers and volumes.  Usually when a docker contaier complains that it is out of memory, the likely true problem is that whatever you have allocated overall for Docker to consume has filled up.  Seeing what images and containers are using then can be a good starting point for freeing up space.  Though remember, you can't delete images that are being used by a container, either stopped or running!

### See ALL images on your machine
```shell
docker ps -a
```

Wihtout the `-a` parameter, this shows you all of the running containers.  Add the parameter though and you see all of the stopped containers.  These could be stopped containers, or failed builds.  Use either the name or the container ID to then `docker rm <name>` to remove the container.  Or `docker start <name>` to restart a container.  Often this can be a treasure hunt of past attempts or tests that are no longer needed.  

### Remove all unused images
```shell
docker rmi...
```
Did you know that 

### See all processes running in a container without logging into the container
```shell
docker top
```

### Clean up your cache in the same command you install
```shell
yum install && yum remove
``` (not the real command!!)