package com.example.demouiview

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth

class LoginActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        auth = FirebaseAuth.getInstance()

        val emailEditText = findViewById<EditText>(R.id.emailEditText)
        val passwordEditText = findViewById<EditText>(R.id.passwordEditText)
        val loginButton = findViewById<Button>(R.id.loginButton)
        val registerTextView = findViewById<TextView>(R.id.registerTextView)
        val forgotPasswordTextView = findViewById<TextView>(R.id.forgotPasswordTextView)

        loginButton.setOnClickListener {
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()

            auth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        Toast.makeText(this, "Login successful!", Toast.LENGTH_SHORT).show()

                        // Redirect to HelloWorldActivity after displaying the toast
                        startActivity(Intent(this, HelloActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this, "Login failed: ${task.exception?.message}", Toast.LENGTH_SHORT).show()
                    }
                }
        }


        registerTextView.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        forgotPasswordTextView.setOnClickListener {
            // Handle forgot password logic
            val resetEmail = emailEditText.text.toString()
            if (resetEmail.isNotEmpty()) {
                auth.sendPasswordResetEmail(resetEmail)
                    .addOnCompleteListener { resetTask ->
                        if (resetTask.isSuccessful) {
                            Toast.makeText(this, "Password reset email sent", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(this, "Error: ${resetTask.exception?.message}", Toast.LENGTH_SHORT).show()
                        }
                    }
            } else {
                Toast.makeText(this, "Enter your email to reset password", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
