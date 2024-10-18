# Curiosity Report
I made the mistake of accidentally having the back arrow hit by the mouse action in my first attempt of this assignment. I lost my entire writeup. Unfortunately, this mistake increased my toil. I am going to work to avoid that by incrementally saving in this version.
## Google's SRE
I focused on Google's SRE principles initially. They seemed to be incredibly interesting and honest. I liked Google's focus on keeping their promises, and their honest approach to defining what was necessary to solve problems.
## Toil - Invent more, toil less
- Remember that you can only take on so much toil.
- We want to reduce toil so that we can spend more time innovating and doing cool engineering tasks.
- As a worker, you want to avoid being the one that loves taking on toil. If you take on too much, it could lead to your team continually taking on more toil, and members leaving for work that they can perform more engineering tasks in.
- You can only take on so much toil before you are going to burnout. Recognize that.
- The maximum is 50% of your time being spent on toil related tasks.
- In the words of Google, lets invent more and toil less.
- Remember the opportunity costs.
## Monitioring - As simple as possible, no simpler
- We must always think about urgency. One can only take on so many urgent tasks in a day before they are going to burnout.
- The four golden signals are latency, traffic, errors, and saturation.
- "Does this alert definitely indicate that users are being negatively affected? Are there detectable cases in which users aren’t being negatively impacted, such as drained traffic or test deployments, that should be filtered out?"
- "Can I take action in response to this alert? Is that action urgent, or could it wait until morning? Could the action be safely automated? Will that action be a long-term fix, or just a short-term workaround?"
- Keep the long-term in mind when you are designing your solution to problems.
- "An alert that’s currently exceptionally rare and hard to automate might become frequent, perhaps even meriting a hacked-together script to resolve it. At this point, someone should find and eliminate the root causes of the problem; if such resolution isn’t possible, the alert response deserves to be fully automated."
- Remember that problems that are currently rare may not be in the future. We need to find the root cause of our problems and reolve them.
- Make your goals achievable, and keep rapid diagnosis at the top of your priorities.
