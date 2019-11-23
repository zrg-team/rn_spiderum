package com.zrgteam.awesome;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "awesome";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Activity currentActivity = this;
    new android.os.Handler().postDelayed(
      new Runnable() {
        public void run() {
          SplashScreen.show(currentActivity);
        }
      },
      500
    );
  }
}
