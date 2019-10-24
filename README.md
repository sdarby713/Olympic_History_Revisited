# Olympic_History_Revisited
https://sdarby713-olympic-medals.herokuapp.com/

### Originally a Team Project
- The "Summer Olympics Winner Countries By Medals" chart was originally created by Li Gou.
- The "Economics of Hosting the Olympic Games" section was created by Fawn Zou.
- Other elements of the page were designed and created by Steve Darby.

### A few issues with the original Olympic_History project, 
largely due to unexpectantly losing a project team member and running out of time:
- The medals table logic did not regard the selection panel, therefore missed out on some flexibility and function
- Routines read from separate CSV files and hardcoded data rather than relying on the database data
- Routines were contained in separate source files, making integration more difficult
- A choropleth map did not make it at all into the final product.

### Without meaningfully altering the charts, 
I took steps to fix the first three points.  In addition, I made a few other alterations:
- Added selection and totalling logic into the app.py flask in order to avoid having to do this in the chart-building routines; adding it there can help us avoid redundant code should the choropleth map ever be added later.
- Moved the medals chart to the top of the page where it is better positioned to work with the selection panel.
- Allowed the medals chart to display up to 15 lines; this could be adjusted according to aesthetics.
- Removed the year-selection drop-down for the Economics section, it can use the top selection panel for this.
- Removed the chart-selection drop-down as well.  I feel that it needlessly complicated the logic, and why not build and show all three charts simultaneously?  Perhaps as an exercise, I will add it back at some time.
- Added additional logic into the app.py flask to enhance the medals chart.  Now, when a single NOC is chosen, the data is summarized and displayed by year.

### Future adjustments:
Because we envisioned showing participating nations as well as medal-winning ones, we kept a considerable number of data rows which are never used on this page.  What we could do is to keep only rows for NOC-Years-Sports where at least one medal is won.  Then we could re-add previously excluded data for additional sports.  It would make the drop-down selector for NOCs a little more manageable.
### Update
This has been done.  We now provide information about medals in all Olympic sports throughout its history.
And for an extra splash of color, I've added a background image for the jumbotron at the top.
