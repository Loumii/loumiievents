/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"ligaeIR2jHyYv9ewWf8dAqzhjNdAXEFF"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"AdX2fON0iLFjM6pnIV6QJCKrnf9NY1RR"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"fxhhIPH8SyFKFvMkTufjYXaQFAghlxxy"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"gZ2W5A8OYYblYy8aK0vcPN2e1J59FMyp"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"qQm65h3AWOLS6p1WVJxBKHH3hr8fxf7l"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"YY3ejI4paxOWzEDJuWpZz7akArSvdPSO"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"338560002896302"] forKey:@"ti.facebook.appid"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];

    return _property;
}
@end
