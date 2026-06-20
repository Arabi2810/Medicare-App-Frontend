# Add project specific ProGuard rules here.

# Firebase / Google Sign-In
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# React Native Firebase
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

# OkHttp / Networking (used internally by Firebase + RN networking)
-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# Notifee
-keep class io.invertase.notifee.** { *; }
-dontwarn io.invertase.notifee.**

# React Native core (general safety net)
-keep,allowobfuscation,allowshrinking class com.facebook.react.** { *; }
-keep,allowobfuscation,allowshrinking interface com.facebook.react.** { *; }

# Gson / JSON serialization (if used by Firebase internally)
-keepattributes Signature
-keep class com.google.gson.** { *; }
-dontwarn com.google.gson.**

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep your app's model/data classes if any are used with reflection
-keep class com.medicare.** { *; }