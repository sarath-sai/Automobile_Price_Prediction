document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");
    const loading = document.querySelector(".loading");

    const resultBox = document.getElementById("resultBox");
    const predictionPrice = document.getElementById("predictionPrice");


    if (!form) {
        console.error("Prediction form not found.");
        return;
    }


    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        /* =========================
           SHOW LOADING
        ========================= */

        if (loading) {
            loading.style.display = "flex";
        }


        /* =========================
           HIDE OLD RESULT
        ========================= */

        if (resultBox) {
            resultBox.style.display = "none";
        }


        try {

            /* =========================
               SEND DATA TO DJANGO
            ========================= */

            const formData = new FormData(form);

            const response = await fetch(
                form.action || window.location.href,
                {
                    method: "POST",
                    body: formData,

                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
            );


            const data = await response.json();


            console.log("Prediction response:", data);


            /* =========================
               CHECK PREDICTION
            ========================= */

            if (!data.success) {

                throw new Error(
                    data.error || "Prediction failed."
                );
            }


            /* =========================
               GET PRICE
            ========================= */

            const price =
                Number(data.price);


            if (!Number.isFinite(price)) {

                throw new Error(
                    "Invalid prediction received."
                );
            }


            /* =========================
               DISPLAY PRICE
            ========================= */

            const formattedPrice =
                price.toLocaleString(
                    "en-IN",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );


            if (predictionPrice) {

                predictionPrice.textContent =
                    "₹" + formattedPrice;
            }


            if (resultBox) {

                resultBox.style.display = "block";
            }


            /* =========================
               HIDE LOADING
            ========================= */

            if (loading) {

                loading.style.display = "none";
            }


            /* =========================
               AI VOICE
            ========================= */

            if ("speechSynthesis" in window) {

                window.speechSynthesis.cancel();


                const speech =
                    new SpeechSynthesisUtterance(
                        "The predicted price is " +
                        price.toFixed(2) +
                        " rupees."
                    );


                speech.lang = "en-US";

                speech.rate = 0.9;

                speech.pitch = 1;

                speech.volume = 1;


                /*
                 * Give the result a moment to appear
                 * before starting the voice.
                 */

                setTimeout(function () {

                    window.speechSynthesis.speak(
                        speech
                    );

                }, 300);
            }


        } catch (error) {

            console.error(
                "Prediction error:",
                error
            );


            if (loading) {

                loading.style.display = "none";
            }


            if (resultBox) {

                resultBox.style.display = "block";

                resultBox.innerHTML = `
                    <h2>Prediction Error</h2>
                    <p>Please enter valid numbers and try again.</p>
                `;
            }

        }

    });

});