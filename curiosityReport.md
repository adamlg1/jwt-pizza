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
  
## Embracing Risk - Extreme reliability comes at a cost
- Most users can't tell the difference between 99.9% reliability and 99% reliability.
- The more time we spend in increasing reliability, the less time we can spend innovating.
- Keep the idea of users not being able to tell the difference between 99.999 reliablity, and design with them in mind.
- Make your system reliable enough, but no more reliable than it needs to be.
- availability = uptime/(uptime + downtime)
- Aggregate availability = successful requests/total requests

### Things to ask yourself related to risk
- What level of service will the users expect?
- Does this service tie directly to revenue (either our revenue, or our customers’ revenue)?
- Is this a paid service, or is it free?
- If there are competitors in the marketplace, what level of service do those competitors provide?
- Is this service targeted at consumers, or at enterprises?

### Testing
- Again, not enough testing and you have embarrassing outages, privacy data leaks, or a number of other press-worthy events. Too much testing, and you might lose your market.
- Remember, 100% coverage does not always equate to 100% confidence. 100% coverage is usually an indication that we should be concerned.

### Error Budget
- This is always good to have.

## Simplicity - The prerequisite to reliability
- Software systems are inherently unstable.
- Our systems do not exist in a vacuum, and as a result cannot be perfectly stable.
- "*If we stop changing the codebase, we stop introducing bugs. If the underlying hardware or libraries never change, neither of these components will introduce bugs. If we freeze the current user base, we’ll never have to scale the system. In fact, a good summary of the SRE approach to managing systems is: "At the end of the day, our job is to keep agility and stability in balance in the system."*
- At the end of the day, our job is to keep agility and stability in balance in the system.
- Boring is actually good in software development.
- Push back when accidental complexity is introduced.
- Don't fall into the "I won't give up my code" trap. You should easily be able to have versioned changes saved and committed somewhere where they are easy to retrieve.
- Some of the most satisfying work is deleting useless lines of code.
- Keeping your codebase simpler will make it easier to maintain.
- Only have minimal, clear API's. It seems like having too many of them confuses even Google.

### Necessary Mindset
**Every line of code changed or added to a project creates the potential for introducing new defects and bugs**

## Testing for Reliability - *"If you haven't tried it, assume it's broken"*
- Your responsibility is to quantify confidence.
- Confidence is not only measured by past reliability, but also by future reliability.
- Testing is a method we use to predict reliability.
- Not something that happens once or twice, testing should be continuous.
- Testing is one of the most valuable skills you can invest in as a software engineer.
- You want a low mean time to repair.

## Patterns
- We have to be realistic. We need to have processes that are simple and do the job. That means they are good enough and don't take away too much time from innovation.
- Always keep cost and opportunity costs at the back of your mind.
- Life happens. We need to recognize that our processes are not always going to be perfect.
- Find a balance/compromise.
- Boring can be good in software development, and help us to avoid making overly complex code.
- Keep your codebase simple.

  
## Other Topics
After reading through Google's SRE principles, there were still other topics that interested me. I started to dive into the current state of UI/UX testing, and how AI is used in monitoring systems. I would like to write a little bit about what I learned on those topics in this report as well. I hope I will be able to add to this report after I finish some more of the projects. Regardless of if I make it to editing this report later, I will continue to read on the suggested curiosity topics that can be seen throughout this course.

I don't know how truthful this statement is, but I read that $1 invested into UI testing brings back $100 in return. The main point is that it is valuable to perform UI testing. The only problem is that UI testing can be difficult. One of the technologies that I was able to research was Percy. Percy uses AI to perform many of the UI tests that usually involve toil and pain when performed by us software developers. On their main webpage, one of my favorite quotes is "Stop wasting time and money on manual testing". I think that we need to think about the costs associated with manually testing UI. In the future, there will probably only be better frameworks that help us with testing our UI, that will lower cost and toil for many engineers.

In addition to AI, there are no code testing frameworks, such as Selenium, Cypress, and Playwright. It appears that many of the testing frameworks that become extremely popular are the ones that are open-source. Other important factors include having a clear folder structure, and being able to run UI testss and have the code saved as you make your movements through the website. It seems like UI testing will continue to find ways to get better and less flaky in the future.
