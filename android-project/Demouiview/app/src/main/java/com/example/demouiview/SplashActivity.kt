package com.example.demouiview

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        // Delay for a few seconds before starting MainActivity
        Handler(Looper.getMainLooper()).postDelayed({
            // Start MainActivity
            startActivity(Intent(this, MainActivity::class.java))
            // Close SplashActivity
            finish()
        }, 10000)  // Delay in milliseconds (e.g., 3000 ms = 3 seconds)
    }
}
