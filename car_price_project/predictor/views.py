import pickle
import os

from django.shortcuts import render
from django.http import JsonResponse


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "car_price_model.pkl"
)

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)


def home(request):

    prediction = None

    if request.method == "POST":

        try:
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

            prediction = float(model.predict(input_data)[0])

            # If JavaScript is requesting the prediction
            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse({
                    "success": True,
                    "price": prediction
                })

        except Exception as error:

            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse({
                    "success": False,
                    "error": str(error)
                }, status=400)

    return render(
        request,
        "predictor/home.html",
        {
            "prediction": prediction
        }
    )