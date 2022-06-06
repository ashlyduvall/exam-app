# Exam App Frontend

## Maintainer
Ashly Duvall

## Description
This is an AngularJS frontend for a simple exam app I made. It's meant
for running in a K8s cluster / Docker compose alongside the backend API.

You can tag questions and run exams against those tags. At somepoint I'll
add some stats stuff so you can see your performance over time.

## Building / Running
Everything should be included, you can either run this with the provided
makefile with e.g.

```bash
make run
```

With this and the API running, just navigate to http://localhost:8080

Or have a look at the provided CI / CD config in `.gitlab-ci.yml`.
