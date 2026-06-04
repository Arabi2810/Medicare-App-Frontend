package com.medicare
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import android.content.Context

class MainActivity : ReactActivity() {
  override fun getMainComponentName(): String = "MediCare"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
    createNotificationChannels()
  }

  private fun createNotificationChannels() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

      // Alarm channel for medication reminders
      val alarmChannel = NotificationChannel(
        "alarm_channel",
        "Medication Reminders",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "Alerts for medication reminders"
        enableVibration(true)
        enableLights(true)
      }
      manager.createNotificationChannel(alarmChannel)

      // Default channel
      val defaultChannel = NotificationChannel(
        "default_channel",
        "General Notifications",
        NotificationManager.IMPORTANCE_DEFAULT
      ).apply {
        description = "General app notifications"
      }
      manager.createNotificationChannel(defaultChannel)
    }
  }
}