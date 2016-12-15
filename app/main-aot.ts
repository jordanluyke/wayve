import {platformBrowser} from '@angular/platform-browser'
import {AppModuleNgFactory} from './../site/app/app.module.ngfactory'
import {enableProdMode} from '@angular/core'

enableProdMode()
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
