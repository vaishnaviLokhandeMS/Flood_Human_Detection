package com.example.demouiview

import android.content.Intent
import android.os.Bundle
import android.view.animation.AnimationUtils
import androidx.appcompat.app.AppCompatActivity
import com.example.demouiview.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    // Declare binding variable
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize binding
        binding = ActivityMainBinding.inflate(layoutInflater)

        // Set the content view to the root of the binding (replaces setContentView)
        setContentView(binding.root)

        // Load and apply animation
        val fadeInTranslate = AnimationUtils.loadAnimation(this, R.anim.fade_in_translate)
        binding.welcomeText.startAnimation(fadeInTranslate)
        binding.loginButton.startAnimation(fadeInTranslate)
        binding.registerButton.startAnimation(fadeInTranslate)

        // Set click listeners using binding
        binding.loginButton.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }

        binding.registerButton.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }
}
