package com.panda.module;

import com.panda.libadjust.Adjust;
//import com.panda.libappsflyer.Appsflyer;
import com.panda.libbugly.Bugly;
import com.panda.libfacebook.Facebook;
import com.panda.libfirebase.Firebase;
import com.panda.libleo.Leo;

public interface ModuleServiceConfig {
    static Class serviceClasses[] = {
            Bugly.class,
            Facebook.class,
            Adjust.class,
//            Appsflyer.class,
            Firebase.class,
            Leo.class
    };
}
