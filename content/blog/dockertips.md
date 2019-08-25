---
title: Docker commands and tips I can't live without
date: "2019-07-09"
description: "Useful commands and settings for Docker development"
tags: ["docker", "tips&tricks"]
---

I have used Docker since late 2015 when I started our greenfield React/NodeJS project.  Like many developers, I tried to grok enough of it to get the project up and running.  And then as we spun off new micro-services, I copied and pasted the previous implementation to the new project.  

But over the last year, I've had to dig into the guts of Docker more and more.  This is the first part of two posts about what I've learned.  There are several commands or settings that I've picked up on that I think are incredibly useful.  These commands have helped increase my understanding and productivity when working with docker containers locally.

### Docker Preferences

### Save a running container as an image
```shell
docker commit container image2
```
Docker builds layers or images for each command that you specify in the Dockerfile. This is a great way to "save" a working copy for further experimentation or other local changes.  When you run the command, the existing container and all of the changes you have made to it are stored as a new image.  This has saved me a couple of times when I started the container but maybe forgot to open a port.  

There is no clean way to open a port on a running container, and if you are trying to get something working without this command you would have to start a new container with the port open and redo any changes.  

Don't use this command to save an image that you want to publish.  The associated Dockerfile isn't updated so you would never be able to recreate the new image that you are creating.  
### Get a summary of all images/containers in Docker
```shell
docker system df
```
Want to see how much memory all of your containers and images are using?  This command gives a nice summary of the space used by images, containers, and volumes.  Usually, when a docker container complains that it is out of memory, the likely true problem is that whatever you have allocated overall for Docker to consume has filled up.  Seeing what images and containers are using then can be a good starting point for freeing up space.  Though remember, you can't delete images that are being used by a container, either stopped or running!

### See ALL images on your machine
```shell
docker ps -a
```

Without the `-a` parameter, this shows you all of the running containers.  Add the parameter though and you see all of the stopped containers.  These could be stopped containers or failed builds.  Use either the name or the container ID to then `docker rm <name>` to remove the container.  Or `docker start <name>` to restart a container.  Often this can be a treasure hunt of past attempts or tests that are no longer needed.  

### Remove all unused images
```shell
docker rmi $(docker images -q -f "dangling=true")
```
If I was smarter about setting up cron jobs, I would have this command run about every 2 weeks.  Every time you build a docker image locally, each step in your dockerfile creates an image.  Most of the time the intermediate layers are removed but untagged images can remain with errors or interrupted builds.  Docker doesn't do a great job of cleaning up those images and they persist until either your disk fills up or you remove them.  

This command gets a list of all your image ids in docker locally (`docker images -q`) and displays only the untagged leaves (`-f "dangling=treu"`).  Those are then removed with the `docker rmi` command.  The nice part of this is that docker will warn and skip deleting any images that are in use from a container.  So it's a relatively safe command to run.

### See all processes running in a container without logging into the container
```shell
docker top <name>
```
Don't want to exec into a container just to see what's running?  Open up a tmux window or a new terminal window and run this command.  Much like UNIX's `top`, it'll take over your window (hence my new window suggestion!) and show you processes running on the container you've specified.  Handy for seeing what processes get spawned (or not) in the container.  Also handy to see why my Macbook's fan suddenly kicked in.  This helped start me on the path to tuning a container that was running out of memory and getting OOMKilled in kubernetes.  I could recreate locally and troubleshoot the issue.

None of these commands are revolutionary or dreamed up by me.  Most I found by googling and reading the docker docs.  Maybe though I've helped you, dear reader, save a few hours by compiling them together in one shot?  Some came with little explanation, so my hope is I've now provided a better understanding of what these do.