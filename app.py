import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/olympic-history.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
medals = Base.classes.medals
NOC = Base.classes.NOC
olympiad = Base.classes.olympiad

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/names")
def names():
    """Return a list of NOC names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(NOC).statement
    qResults = pd.read_sql_query(stmt, db.session.bind)

    # print(qResults)

    data_json = qResults.to_json(orient='records')

    # Return a list of the NOCs
    return data_json
    # return jsonify("This is it!")

@app.route("/olympiads")
def years():
    """Return a list of NOC names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(olympiad).statement
    qResults = pd.read_sql_query(stmt, db.session.bind)

    # print(qResults)

    data_json = qResults.to_json(orient='records')

    # Return the olympiad data
    return data_json

@app.route("/medals/<selFrDate>/<selToDate>/<selNOC>/<selSport>/<selChecked>")
def samples(selFrDate, selToDate, selNOC, selSport, selChecked):
    stmt = db.session.query(medals).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    selFrDate = int(selFrDate)
    selToDate = int(selToDate)

    # Filter the data based on the date range
    df = df.loc[df["Year"] >= selFrDate, :]
    df = df.loc[df["Year"] <= selToDate, :]

    # Filter the data based on NOC
    if (selNOC != "All")  :
        df = df.loc[df["NOC"] == selNOC, :]

    # Filter the data based on Sport
    if (selSport != "All")  :
        df = df.loc[df["Sport"] == selSport, :]

    # sum up the total number of each medal color based on selection
    if (selChecked[0] == "M"):
        if (selChecked[3] == "G"):
            df.Gold_t += df.Gold_m
        if (selChecked[4] == "S"):
            df.Silver_t += df.Silver_m
        if (selChecked[5] == "B"):
            df.Bronze_t += df.Bronze_m
    if (selChecked[1] == "W"):
        if (selChecked[3] == "G"):
            df.Gold_t += df.Gold_w
        if (selChecked[4] == "S"):
            df.Silver_t += df.Silver_w
        if (selChecked[5] == "B"):
            df.Bronze_t += df.Bronze_w
    if (selChecked[2] == "X"):
        if (selChecked[3] == "G"):
            df.Gold_t += df.Gold_x
        if (selChecked[4] == "S"):
            df.Silver_t += df.Silver_x
        if (selChecked[5] == "B"):
            df.Bronze_t += df.Bronze_x

    df["Total_Medals"] = df["Gold_t"] + df["Silver_t"] + df["Bronze_t"]



    if selNOC == 'All': 
        groupby_noc = df.groupby(['NOC'], as_index=False)
        summed_df = groupby_noc.sum()
        summed_df["Key"] = summed_df["NOC"]
    else:
        groupby_noc = df.groupby(['Year'], as_index=False)
        summed_df = groupby_noc.sum()
        summed_df["Key"] = summed_df["Year"]

    # these are the only columns we still need at this point
    xyz = ["Key", "Gold_t", "Silver_t", "Bronze_t", "Total_Medals"]
    df2 = summed_df[xyz]

    # sort what we have
    sorted_df = df2.sort_values("Total_Medals", ascending=False)

    # Format the data to send as json
    data_json = sorted_df.to_json(orient='records')
 
    return data_json
    # return jsonify(sorted_df)


if __name__ == "__main__":
    app.run()
