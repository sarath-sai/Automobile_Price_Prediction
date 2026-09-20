import pickle
import os

from django.shortcuts import render


# Load the trained machine learning model
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "car_price_model.pkl"
)

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)


def home(request):
    prediction = None

    if request.method == "POST":
        engine_size = float(request.POST["engine_size"])
        horsepower = float(request.POST["horsepower"])
        curb_weight = float(request.POST["curb_weight"])
        highway_mpg = float(request.POST["highway_mpg"])

        input_data = [[
            engine_size,
            horsepower,
            curb_weight,
            highway_mpg
        ]]

        prediction = model.predict(input_data)[0]

    return render(
        request,
        "predictor/home.html",
        {"prediction": prediction}
    )