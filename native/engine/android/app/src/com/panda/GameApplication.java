package com.panda;

import android.app.Application;

import com.panda.module.ModuleManager;
import com.panda.util.PDLog;

public class GameApplication extends Application { @Override
    public void onCreate() {
        super.onCreate();
    PDLog.i("initApplication","initApplication0");
    ModuleManager.shared().initApplication(this);
    }
}
