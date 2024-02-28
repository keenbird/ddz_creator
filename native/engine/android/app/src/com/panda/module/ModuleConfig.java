package com.panda.module;


public interface ModuleConfig extends ModuleServiceConfig {
    static Class serviceBaseClasses[] = {
            Device.class
    };
    static Class serviceClasses[] = {
            Wechat.class
    };
}
