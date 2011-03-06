Gertrude
========

A basic jquery plugin for extracting known entities from text input fields. 
The purpose for this is to expand the interactive capabilities of a UI without 
relying on low-latency connections to server-side code. 

You give it an entity definition and tell it which text fields to watch, and it
will trigger your event handler whenever a listed entity is detected. You can
also specify custom tokenisation and normalisation functions to override the 
defaults.