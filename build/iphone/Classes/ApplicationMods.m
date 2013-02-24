#import "ApplicationMods.h"

@implementation ApplicationMods

+ (NSArray*) compiledMods
{
	NSMutableArray *modules = [NSMutableArray array];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"tiviewshadow",@"name",@"ti.viewshadow",@"moduleid",@"0.4",@"version",@"03caadce-b6e4-414e-8dae-f24c855f0dd8",@"guid",@"",@"licensekey",nil]];
	return modules;
}

@end
