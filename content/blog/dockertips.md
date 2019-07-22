---
title: Docker commands and tips I can't live without
date: "2019-07-09"
description: "Useful commands and settings for Docker development"
tags: ["docker", "tips&tricks"]
---

I have used Docker since late 2015, when I started our greenfield React/NodeJS project.  Like many developers, I tried to grok enough of it to get the project up and running.  And then as we spun off new micro-services, I copied and pasted the previous implementation to the new project.  

But over the last year, I've had to dig into the guts of Docker more and more.  This is the first part of two posts about what I've learned.  There's several comamnds or settings that I've picked up on that I think are incredibly useful.  

### Docker Preferences

### Save a running container as an image
```shell
docker commit container image2
```
Docker builds layers, or images for each command that you specify in the Dockerfile.  
### Get a summary of all images/containers in Docker
```shell
docker system df
```

### See ALL images on your machine
```shell
docker ps -a
```
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