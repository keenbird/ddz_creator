package com.panda;

import android.app.Application;

import com.panda.module.ModuleManager;

public class GameApplication extends Application { @Override
    public void onCreate() {
        super.onCreate();
        ModuleManager.shared().initApplication(this);
    }
}
