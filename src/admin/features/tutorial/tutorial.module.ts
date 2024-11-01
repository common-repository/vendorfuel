declare const angular: ng.IAngularStatic;
import { TutorialRoutingModule } from './tutorial-routing.module';

export const TutorialModule = angular
	.module( 'TutorialModule', [ TutorialRoutingModule ] )
	.name;
