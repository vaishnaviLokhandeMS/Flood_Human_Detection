package com.example.demo

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import org.json.JSONArray
import java.io.IOException

class MainActivity : AppCompatActivity() {

    private val client = OkHttpClient()
    private val locationSet = mutableSetOf<String>()  // Set to store unique locations as strings

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Set up the button to fetch locations and move to map activity
        val fetchButton = findViewById<Button>(R.id.fetchButton)
        fetchButton.setOnClickListener {
            fetchLocationsAndOpenMap()
        }
    }

    // Function to fetch locations and pass them to the MapActivity
    private fun fetchLocationsAndOpenMap() {
        val url = "https://e87f-123-252-204-198.ngrok-free.app/locations/buffer"  // Replace with your actual API URL

        // Create a request
        val request = Request.Builder().url(url).build()

        // Make an asynchronous GET request
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("MainActivity", "Failed to fetch data: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let { responseBody ->
                    val jsonData = responseBody.string()

                    // Print the received data for debugging
                    Log.d("MainActivity", "Received data: $jsonData")

                    val jsonArray = JSONArray(jsonData)

                    // Clear the existing set
                    locationSet.clear()

                    // Loop through the JSONArray and store unique locations
                    for (i in 0 until jsonArray.length()) {
                        val jsonObject = jsonArray.getJSONObject(i)
                        val lat = jsonObject.getDouble("latitude")
                        val lng = jsonObject.getDouble("longitude")
                        val latLngString = "$lat,$lng"

                        // Add to the set to ensure uniqueness
                        locationSet.add(latLngString)
                    }

                    // Pass the locations to the MapActivity
                    val intent = Intent(this@MainActivity, MapActivity::class.java).apply {
                        putStringArrayListExtra("locations", ArrayList(locationSet))
                    }
                    startActivity(intent)
                }
            }
        })
    }
}
