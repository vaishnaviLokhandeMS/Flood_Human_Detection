package com.example.demo

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions

class MapActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var googleMap: GoogleMap
    private lateinit var waypoints: List<LatLng>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)

        // Get the locations from the intent
        val locationStrings = intent.getStringArrayListExtra("locations")
        waypoints = locationStrings?.map {
            val (lat, lng) = it.split(",").map { it.toDouble() }
            LatLng(lat, lng)
        } ?: listOf()

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map

        // Define source (start) and destination as the same point (Delhi)
        val startAndDestination = LatLng(16.7050, 74.2433)

        // Add a marker for source/destination
        googleMap.addMarker(MarkerOptions().position(startAndDestination).title("Start/Destination"))

        // Add markers for waypoints
        for (waypoint in waypoints) {
            googleMap.addMarker(MarkerOptions().position(waypoint).title("Waypoint: $waypoint"))
        }

        // Move the camera to the start location
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(startAndDestination, 5f))

        // Launch Google Maps with directions and waypoints
        openGoogleMapsWithWaypoints(startAndDestination, startAndDestination, waypoints)
    }

    // Launch Google Maps app with directions and waypoints from the location set
    private fun openGoogleMapsWithWaypoints(source: LatLng, destination: LatLng, waypoints: List<LatLng>) {
        val sourceLatLng = "${source.latitude},${source.longitude}"
        val destinationLatLng = "${destination.latitude},${destination.longitude}"
        val waypointsString = waypoints.joinToString("|") { "${it.latitude},${it.longitude}" }

        // Create the Google Maps URL with the source, destination, and waypoints
        val url = "https://www.google.com/maps/dir/?api=1" +
                "&origin=$sourceLatLng" +
                "&destination=$destinationLatLng" +
                "&waypoints=$waypointsString" +
                "&travelmode=driving"

        // Create an intent to launch Google Maps with the URL
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        intent.setPackage("com.google.android.apps.maps") // Ensure it opens in Google Maps

        // Check if there's an app that can handle the intent
        if (intent.resolveActivity(packageManager) != null) {
            startActivity(intent)
        }
    }
}
