require=function s(a,r,c){function u(e,t){if(!r[e]){if(!a[e]){var i="function"==typeof require&&require;if(!t&&i)return i(e,!0);if(h)return h(e,!0);var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}var o=r[e]={exports:{}};a[e][0].call(o.exports,function(t){return u(a[e][1][t]||t)},o,o.exports,s,a,r,c)}return r[e].exports}for(var h="function"==typeof require&&require,t=0;t<c.length;t++)u(c[t]);return u}({ActorRenderer:[function(t,e,i){"use strict";cc._RF.push(e,"1a792KO87NBg7vCCIp1jq+j","ActorRenderer");var a=t("Game"),n=t("Types"),o=t("Utils"),s=n.ActorPlayingState;cc.Class({extends:cc.Component,properties:{playerInfo:cc.Node,stakeOnTable:cc.Node,cardInfo:cc.Node,cardPrefab:cc.Prefab,anchorCards:cc.Node,spPlayerName:cc.Sprite,labelPlayerName:cc.Label,labelTotalStake:cc.Label,spPlayerPhoto:cc.Sprite,callCounter:cc.ProgressBar,labelStakeOnTable:cc.Label,spChips:{default:[],type:cc.Sprite},labelCardInfo:cc.Label,spCardInfo:cc.Sprite,animFX:cc.Node,cardSpace:0},onLoad:function(){},init:function(t,e,i,n,o){this.actor=this.getComponent("Actor"),this.isCounting=!1,this.counterTimer=0,this.turnDuration=n,this.playerInfo.position=e,this.stakeOnTable.position=i,this.labelPlayerName.string=t.name,this.updateTotalStake(t.gold);var s=t.photoIdx%5;this.spPlayerPhoto.spriteFrame=a.instance.assetMng.playerPhotos[s],this.animFX=this.animFX.getComponent("FXPlayer"),this.animFX.init(),this.animFX.show(!1),this.cardInfo.active=!1,o&&(this.spCardInfo.getComponent("SideSwitcher").switchSide(),this.spPlayerName.getComponent("SideSwitcher").switchSide())},update:function(t){this.isCounting&&(this.callCounter.progress=this.counterTimer/this.turnDuration,this.counterTimer+=t,this.counterTimer>=this.turnDuration&&(this.isCounting=!1,this.callCounter.progress=1))},initDealer:function(){this.actor=this.getComponent("Actor"),this.animFX=this.animFX.getComponent("FXPlayer"),this.animFX.init(),this.animFX.show(!1)},updateTotalStake:function(t){this.labelTotalStake.string="$"+t},startCountdown:function(){this.callCounter&&(this.isCounting=!0,this.counterTimer=0)},resetCountdown:function(){this.callCounter&&(this.isCounting=!1,this.counterTimer=0,this.callCounter.progress=0)},playBlackJackFX:function(){this.animFX.playFX("blackjack")},playBustFX:function(){this.animFX.playFX("bust")},onDeal:function(t,e){var i=cc.instantiate(this.cardPrefab).getComponent("Card");this.anchorCards.addChild(i.node),i.init(t),i.reveal(e);var n=cc.p(0,0),o=this.actor.cards.length-1,s=cc.p(this.cardSpace*o,0);i.node.setPosition(n),this._updatePointPos(s.x);var a=cc.moveTo(.5,s),r=cc.callFunc(this._onDealEnd,this);i.node.runAction(cc.sequence(a,r))},_onDealEnd:function(t){this.resetCountdown(),this.actor.state===s.Normal&&this.startCountdown(),this.updatePoint()},onReset:function(){this.cardInfo.active=!1,this.anchorCards.removeAllChildren(),this._resetChips()},onRevealHoldCard:function(){cc.find("cardPrefab",this.anchorCards).getComponent("Card").reveal(!0),this.updateState()},updatePoint:function(){switch(this.cardInfo.active=!0,this.labelCardInfo.string=this.actor.bestPoint,this.actor.hand){case n.Hand.BlackJack:this.animFX.show(!0),this.animFX.playFX("blackjack");break;case n.Hand.FiveCard:}},_updatePointPos:function(t){this.cardInfo.setPosition(t+50,0)},showStakeChips:function(t){var e=this.spChips,i=0;5e4<t?i=5:25e3<t?i=4:1e4<t?i=3:5e3<t?i=2:0<t&&(i=1);for(var n=0;n<i;++n)e[n].enabled=!0},_resetChips:function(){for(var t=0;t<this.spChips.length;++t)this.spChips.enabled=!1},updateState:function(){switch(this.actor.state){case s.Normal:this.cardInfo.active=!0,this.spCardInfo.spriteFrame=a.instance.assetMng.texCardInfo,this.updatePoint();break;case s.Bust:var t=o.getMinMaxPoint(this.actor.cards).min;this.labelCardInfo.string="爆牌("+t+")",this.spCardInfo.spriteFrame=a.instance.assetMng.texBust,this.cardInfo.active=!0,this.animFX.show(!0),this.animFX.playFX("bust"),this.resetCountdown();break;case s.Stand:var e=o.getMinMaxPoint(this.actor.cards).max;this.labelCardInfo.string="停牌("+e+")",this.spCardInfo.spriteFrame=a.instance.assetMng.texCardInfo,this.resetCountdown()}}}),cc._RF.pop()},{Game:"Game",Types:"Types",Utils:"Utils"}],Actor:[function(t,e,i){"use strict";cc._RF.push(e,"7d008dTf6xB2Z0wCAdzh1Rx","Actor");var n=t("Types"),o=t("Utils"),s=n.ActorPlayingState;cc.Class({extends:cc.Component,properties:{cards:{default:[],serializable:!1,visible:!1},holeCard:{default:null,serializable:!1,visible:!1},bestPoint:{get:function(){return o.getMinMaxPoint(this.cards).max}},hand:{get:function(){var t=this.cards.length;return this.holeCard&&++t,5<=t?n.Hand.FiveCard:2===t&&21===this.bestPoint?n.Hand.BlackJack:n.Hand.Normal}},canReport:{get:function(){return this.hand!==n.Hand.Normal},visible:!1},renderer:{default:null,type:cc.Node},state:{default:s.Normal,notify:function(t){this.state!==t&&this.renderer.updateState()},type:s,serializable:!1}},init:function(){this.ready=!0,this.renderer=this.getComponent("ActorRenderer")},addCard:function(t){this.cards.push(t),this.renderer.onDeal(t,!0);var e=this.holeCard?[this.holeCard].concat(this.cards):this.cards;o.isBust(e)&&(this.state=s.Bust)},addHoleCard:function(t){this.holeCard=t,this.renderer.onDeal(t,!1)},stand:function(){this.state=s.Stand},revealHoldCard:function(){this.holeCard&&(this.cards.unshift(this.holeCard),this.holeCard=null,this.renderer.onRevealHoldCard())},report:function(){this.state=s.Report},reset:function(){this.cards=[],this.holeCard=null,this.reported=!1,this.state=s.Normal,this.renderer.onReset()}}),cc._RF.pop()},{Types:"Types",Utils:"Utils"}],AssetMng:[function(t,e,i){"use strict";cc._RF.push(e,"54522LcoVpPHbrqYgwp/1Qm","AssetMng");cc.Class({extends:cc.Component,properties:{texBust:cc.SpriteFrame,texCardInfo:cc.SpriteFrame,texCountdown:cc.SpriteFrame,texBetCountdown:cc.SpriteFrame,playerPhotos:[cc.SpriteFrame]}});cc._RF.pop()},{}],AudioMng:[function(t,e,i){"use strict";cc._RF.push(e,"01ca4tStvVH+JmZ5TNcmuAu","AudioMng"),cc.Class({extends:cc.Component,properties:{winAudio:{default:null,url:cc.AudioClip},loseAudio:{default:null,url:cc.AudioClip},cardAudio:{default:null,url:cc.AudioClip},buttonAudio:{default:null,url:cc.AudioClip},chipsAudio:{default:null,url:cc.AudioClip},bgm:{default:null,url:cc.AudioClip}},playMusic:function(){cc.audioEngine.playMusic(this.bgm,!0)},pauseMusic:function(){cc.audioEngine.pauseMusic()},resumeMusic:function(){cc.audioEngine.resumeMusic()},_playSFX:function(t){cc.audioEngine.playEffect(t,!1)},playWin:function(){this._playSFX(this.winAudio)},playLose:function(){this._playSFX(this.loseAudio)},playCard:function(){this._playSFX(this.cardAudio)},playChips:function(){this._playSFX(this.chipsAudio)},playButton:function(){this._playSFX(this.buttonAudio)}}),cc._RF.pop()},{}],Bet:[function(t,e,i){"use strict";cc._RF.push(e,"28f38yToT1Pw7NgyeCvRxDC","Bet");var o=t("Game");cc.Class({extends:cc.Component,properties:{chipPrefab:cc.Prefab,btnChips:{default:[],type:cc.Node},chipValues:{default:[],type:"Integer"},anchorChipToss:cc.Node},init:function(){this._registerBtns()},_registerBtns:function(){for(var i=this,t=function(e){i.btnChips[n].on("touchstart",function(t){o.instance.addStake(i.chipValues[e])&&i.playAddChip()},this)},n=0;n<i.btnChips.length;++n)t(n)},playAddChip:function(){var t=cc.p(50*cc.randomMinus1To1(),50*cc.randomMinus1To1()),e=cc.instantiate(this.chipPrefab);this.anchorChipToss.addChild(e),e.setPosition(t),e.getComponent("TossChip").play()},resetChips:function(){o.instance.resetStake(),o.instance.info.enabled=!1,this.resetTossedChips()},resetTossedChips:function(){this.anchorChipToss.removeAllChildren()}}),cc._RF.pop()},{Game:"Game"}],ButtonScaler:[function(t,e,i){"use strict";cc._RF.push(e,"a171dSnCXFMRIqs1IWdvgWM","ButtonScaler"),cc.Class({extends:cc.Component,properties:{pressedScale:1,transDuration:0},onLoad:function(){var e=this,i=cc.find("Menu/AudioMng")||cc.find("Game/AudioMng");function t(t){this.stopAllActions(),this.runAction(e.scaleUpAction)}i&&(i=i.getComponent("AudioMng")),e.initScale=this.node.scale,e.button=e.getComponent(cc.Button),e.scaleDownAction=cc.scaleTo(e.transDuration,e.pressedScale),e.scaleUpAction=cc.scaleTo(e.transDuration,e.initScale),this.node.on("touchstart",function(t){this.stopAllActions(),i&&i.playButton(),this.runAction(e.scaleDownAction)},this.node),this.node.on("touchend",t,this.node),this.node.on("touchcancel",t,this.node)}}),cc._RF.pop()},{}],Card:[function(t,e,i){"use strict";cc._RF.push(e,"ab67e5QkiVCBZ3DIMlWhiAt","Card"),cc.Class({extends:cc.Component,properties:{point:cc.Label,suit:cc.Sprite,mainPic:cc.Sprite,cardBG:cc.Sprite,redTextColor:cc.Color.WHITE,blackTextColor:cc.Color.WHITE,texFrontBG:cc.SpriteFrame,texBackBG:cc.SpriteFrame,texFaces:{default:[],type:cc.SpriteFrame},texSuitBig:{default:[],type:cc.SpriteFrame},texSuitSmall:{default:[],type:cc.SpriteFrame}},init:function(t){var e=10<t.point;this.mainPic.spriteFrame=e?this.texFaces[t.point-10-1]:this.texSuitBig[t.suit-1],this.point.string=t.pointName,t.isRedSuit?this.point.node.color=this.redTextColor:this.point.node.color=this.blackTextColor,this.suit.spriteFrame=this.texSuitSmall[t.suit-1]},reveal:function(t){this.point.node.active=t,this.suit.node.active=t,this.mainPic.node.active=t,this.cardBG.spriteFrame=t?this.texFrontBG:this.texBackBG}}),cc._RF.pop()},{}],Dealer:[function(o,t,e){"use strict";cc._RF.push(t,"ce2dfoqEulHCLjS1Z9xPN7t","Dealer");var i=o("Actor"),n=o("Utils");cc.Class({extends:i,properties:{bestPoint:{get:function(){var t=this.holeCard?[this.holeCard].concat(this.cards):this.cards;return n.getMinMaxPoint(t).max},override:!0}},init:function(){this._super(),this.renderer.initDealer()},wantHit:function(){var t=o("Game"),e=o("Types"),i=this.bestPoint;if(21===i)return!1;if(i<=11)return!0;var n=t.instance.player;switch(t.instance._getPlayerResult(n,this)){case e.Outcome.Win:return!0;case e.Outcome.Lose:return!1}return this.bestPoint<17}}),cc._RF.pop()},{Actor:"Actor",Game:"Game",Types:"Types",Utils:"Utils"}],Decks:[function(t,e,i){"use strict";cc._RF.push(e,"17024G0JFpHcLI5GREbF8VN","Decks");var o=t("Types");function n(t){this._numberOfDecks=t,this._cardIds=new Array(52*t),this.reset()}n.prototype.reset=function(){this._cardIds.length=52*this._numberOfDecks;for(var t=0,e=o.Card.fromId,i=0;i<this._numberOfDecks;++i)for(var n=0;n<52;++n)this._cardIds[t]=e(n),++t},n.prototype.draw=function(){var t=this._cardIds,e=t.length;if(0===e)return null;var i=Math.random()*e|0,n=t[i],o=t[e-1];return t[i]=o,t.length=e-1,n},e.exports=n,cc._RF.pop()},{Types:"Types"}],FXPlayer:[function(t,e,i){"use strict";cc._RF.push(e,"68da2yjdGVMSYhXLN9DukIB","FXPlayer"),cc.Class({extends:cc.Component,init:function(){this.anim=this.getComponent(cc.Animation),this.sprite=this.getComponent(cc.Sprite)},show:function(t){this.sprite.enabled=t},playFX:function(t){this.anim.stop(),this.anim.play(t)},hideFX:function(){this.sprite.enabled=!1}}),cc._RF.pop()},{}],Game:[function(t,e,i){"use strict";cc._RF.push(e,"63738OONCFKHqsf4QSeJSun","Game");var a=t("PlayerData").players,n=t("Decks"),o=t("Types"),s=o.ActorPlayingState,r=t("game-fsm"),c=cc.Class({extends:cc.Component,properties:{playerAnchors:{default:[],type:cc.Node},playerPrefab:cc.Prefab,dealer:cc.Node,inGameUI:cc.Node,betUI:cc.Node,assetMng:cc.Node,audioMng:cc.Node,turnDuration:0,betDuration:0,totalChipsNum:0,totalDiamondNum:0,numberOfDecks:{default:1,type:"Integer"}},statics:{instance:null},onLoad:function(){(c.instance=this).inGameUI=this.inGameUI.getComponent("InGameUI"),this.assetMng=this.assetMng.getComponent("AssetMng"),this.audioMng=this.audioMng.getComponent("AudioMng"),this.betUI=this.betUI.getComponent("Bet"),this.inGameUI.init(this.betDuration),this.betUI.init(),this.dealer=this.dealer.getComponent("Dealer"),this.dealer.init(),this.player=null,this.createPlayers(),this.info=this.inGameUI.resultTxt,this.totalChips=this.inGameUI.labelTotalChips,this.decks=new n(this.numberOfDecks),this.fsm=r,this.fsm.init(this),this.updateTotalChips(),this.audioMng.playMusic()},addStake:function(t){return this.totalChipsNum<t?(console.log("not enough chips!"),this.info.enabled=!0,!(this.info.string="金币不足!")):(this.totalChipsNum-=t,this.updateTotalChips(),this.player.addStake(t),this.audioMng.playChips(),this.info.enabled=!1,this.info.string="请下注",!0)},resetStake:function(){this.totalChipsNum+=this.player.stakeNum,this.player.resetStake(),this.updateTotalChips()},updateTotalChips:function(){this.totalChips.string=this.totalChipsNum,this.player.renderer.updateTotalStake(this.totalChipsNum)},createPlayers:function(){for(var t=0;t<5;++t){var e=cc.instantiate(this.playerPrefab),i=this.playerAnchors[t],n=2<t;i.addChild(e),e.position=cc.p(0,0);var o=cc.find("anchorPlayerInfo",i).getPosition(),s=cc.find("anchorStake",i).getPosition();e.getComponent("ActorRenderer").init(a[t],o,s,this.turnDuration,n),2===t&&(this.player=e.getComponent("Player"),this.player.init())}},hit:function(){this.player.addCard(this.decks.draw()),this.player.state===s.Bust&&this.fsm.onPlayerActed(),this.audioMng.playCard(),this.audioMng.playButton()},stand:function(){this.player.stand(),this.audioMng.playButton(),this.fsm.onPlayerActed()},deal:function(){this.fsm.toDeal(),this.audioMng.playButton()},start:function(){this.fsm.toBet(),this.audioMng.playButton()},report:function(){this.player.report(),this.fsm.onPlayerActed()},quitToMenu:function(){cc.director.loadScene("menu")},onEnterDealState:function(){this.betUI.resetTossedChips(),this.inGameUI.resetCountdown(),this.player.renderer.showStakeChips(this.player.stakeNum),this.player.addCard(this.decks.draw());var t=this.decks.draw();this.dealer.addHoleCard(t),this.player.addCard(this.decks.draw()),this.dealer.addCard(this.decks.draw()),this.audioMng.playCard(),this.fsm.onDealed()},onPlayersTurnState:function(t){t&&this.inGameUI.showGameState()},onEnterDealersTurnState:function(){for(;this.dealer.state===s.Normal;)this.dealer.wantHit()?this.dealer.addCard(this.decks.draw()):this.dealer.stand();this.fsm.onDealerActed()},onEndState:function(t){if(t)switch(this.dealer.revealHoldCard(),this.inGameUI.showResultState(),this._getPlayerResult(this.player,this.dealer)){case o.Outcome.Win:this.info.string="You Win",this.audioMng.pauseMusic(),this.audioMng.playWin(),this.totalChipsNum+=this.player.stakeNum;var e=this.player.stakeNum;!this.player.state===o.ActorPlayingState.Report&&(this.player.hand===o.Hand.BlackJack?e*=1.5:e*=2),this.totalChipsNum+=e,this.updateTotalChips();break;case o.Outcome.Lose:this.info.string="You Lose",this.audioMng.pauseMusic(),this.audioMng.playLose();break;case o.Outcome.Tie:this.info.string="Draw",this.totalChipsNum+=this.player.stakeNum,this.updateTotalChips()}this.info.enabled=t},onBetState:function(t){t&&(this.decks.reset(),this.player.reset(),this.dealer.reset(),this.info.string="请下注",this.inGameUI.showBetState(),this.inGameUI.startCountdown(),this.audioMng.resumeMusic()),this.info.enabled=t},_getPlayerResult:function(t,e){var i=o.Outcome;return t.state===s.Bust?i.Lose:e.state===s.Bust?i.Win:t.state===s.Report?i.Win:t.hand>e.hand?i.Win:t.hand<e.hand?i.Lose:t.bestPoint===e.bestPoint?i.Tie:t.bestPoint<e.bestPoint?i.Lose:i.Win}});cc._RF.pop()},{Decks:"Decks",PlayerData:"PlayerData",Types:"Types","game-fsm":"game-fsm"}],InGameUI:[function(t,e,i){"use strict";cc._RF.push(e,"f192efroeFEyaxtfh8TVXYz","InGameUI");t("Game");cc.Class({extends:cc.Component,properties:{panelChat:cc.Node,panelSocial:cc.Node,betStateUI:cc.Node,gameStateUI:cc.Node,resultTxt:cc.Label,betCounter:cc.ProgressBar,btnStart:cc.Node,labelTotalChips:cc.Label},init:function(t){this.panelChat.active=!1,this.panelSocial.active=!1,this.resultTxt.enabled=!1,this.betStateUI.active=!0,this.gameStateUI.active=!1,this.btnStart.active=!1,this.betDuration=t,this.betTimer=0,this.isBetCounting=!1},startCountdown:function(){this.betCounter&&(this.betTimer=0,this.isBetCounting=!0)},resetCountdown:function(){this.betCounter&&(this.betTimer=0,this.isBetCounting=!1,this.betCounter.progress=0)},showBetState:function(){this.betStateUI.active=!0,this.gameStateUI.active=!1,this.btnStart.active=!1},showGameState:function(){this.betStateUI.active=!1,this.gameStateUI.active=!0,this.btnStart.active=!1},showResultState:function(){this.betStateUI.active=!1,this.gameStateUI.active=!1,this.btnStart.active=!0},toggleChat:function(){this.panelChat.active=!this.panelChat.active},toggleSocial:function(){this.panelSocial.active=!this.panelSocial.active},update:function(t){this.isBetCounting&&(this.betCounter.progress=this.betTimer/this.betDuration,this.betTimer+=t,this.betTimer>=this.betDuration&&(this.isBetCounting=!1,this.betCounter.progress=1))}}),cc._RF.pop()},{Game:"Game"}],Menu:[function(t,e,i){"use strict";cc._RF.push(e,"20f60m+3RlGO7x2/ARzZ6Qc","Menu"),cc.Class({extends:cc.Component,properties:{audioMng:cc.Node},onLoad:function(){this.audioMng=this.audioMng.getComponent("AudioMng"),this.audioMng.playMusic(),cc.director.preloadScene("table",function(){cc.log("Next scene preloaded")})},playGame:function(){cc.director.loadScene("table")},update:function(t){}}),cc._RF.pop()},{}],ModalUI:[function(t,e,i){"use strict";cc._RF.push(e,"54397cUxehGzqEqpMUGHejs","ModalUI"),cc.Class({extends:cc.Component,properties:{mask:cc.Node},onLoad:function(){},onEnable:function(){this.mask.on("touchstart",function(t){t.stopPropagation()}),this.mask.on("touchend",function(t){t.stopPropagation()})},onDisable:function(){this.mask.off("touchstart",function(t){t.stopPropagation()}),this.mask.off("touchend",function(t){t.stopPropagation()})}}),cc._RF.pop()},{}],PlayerData:[function(t,e,i){"use strict";cc._RF.push(e,"4f9c5eXxqhHAKLxZeRmgHDB","PlayerData");e.exports={players:[{name:"燃烧吧，蛋蛋儿军",gold:3e3,photoIdx:0},{name:"地方政府",gold:2e3,photoIdx:1},{name:"手机超人",gold:1500,photoIdx:2},{name:"天灵灵，地灵灵",gold:500,photoIdx:3},{name:"哟哟，切克闹",gold:9e3,photoIdx:4},{name:"学姐不要死",gold:5e3,photoIdx:5},{name:"提百万",gold:1e4,photoIdx:6}]},cc._RF.pop()},{}],Player:[function(t,e,i){"use strict";cc._RF.push(e,"226a2AvzRpHL7SJGTMy5PDX","Player");var n=t("Actor");cc.Class({extends:n,init:function(){this._super(),this.labelStake=this.renderer.labelStakeOnTable,this.stakeNum=0},reset:function(){this._super(),this.resetStake()},addCard:function(t){this._super(t)},addStake:function(t){this.stakeNum+=t,this.updateStake(this.stakeNum)},resetStake:function(t){this.stakeNum=0,this.updateStake(this.stakeNum)},updateStake:function(t){this.labelStake.string=t}}),cc._RF.pop()},{Actor:"Actor"}],RankItem:[function(t,e,i){"use strict";cc._RF.push(e,"1657ewfijBOXLq5zGqr6PvE","RankItem"),cc.Class({extends:cc.Component,properties:{spRankBG:cc.Sprite,labelRank:cc.Label,labelPlayerName:cc.Label,labelGold:cc.Label,spPlayerPhoto:cc.Sprite,texRankBG:cc.SpriteFrame,texPlayerPhoto:cc.SpriteFrame},init:function(t,e){t<3?(this.labelRank.node.active=!1,this.spRankBG.spriteFrame=this.texRankBG[t]):(this.labelRank.node.active=!0,this.labelRank.string=(t+1).toString()),this.labelPlayerName.string=e.name,this.labelGold.string=e.gold.toString(),this.spPlayerPhoto.spriteFrame=this.texPlayerPhoto[e.photoIdx]},update:function(t){}}),cc._RF.pop()},{}],RankList:[function(t,e,i){"use strict";cc._RF.push(e,"fe3fcIxCFFLrKHg6s5+xRUU","RankList");var n=t("PlayerData").players;cc.Class({extends:cc.Component,properties:{scrollView:cc.ScrollView,prefabRankItem:cc.Prefab,rankCount:0},onLoad:function(){this.content=this.scrollView.content,this.populateList()},populateList:function(){for(var t=0;t<this.rankCount;++t){var e=n[t],i=cc.instantiate(this.prefabRankItem);i.getComponent("RankItem").init(t,e),this.content.addChild(i)}},update:function(t){}}),cc._RF.pop()},{PlayerData:"PlayerData"}],SideSwitcher:[function(t,e,i){"use strict";cc._RF.push(e,"3aae7lZKyhPqqsLD3wMKl6X","SideSwitcher"),cc.Class({extends:cc.Component,properties:{retainSideNodes:{default:[],type:cc.Node}},switchSide:function(){this.node.scaleX=-this.node.scaleX;for(var t=0;t<this.retainSideNodes.length;++t){var e=this.retainSideNodes[t];e.scaleX=-e.scaleX}}}),cc._RF.pop()},{}],TossChip:[function(t,e,i){"use strict";cc._RF.push(e,"b4eb5Lo6U1IZ4eJWuxShCdH","TossChip"),cc.Class({extends:cc.Component,properties:{anim:cc.Animation},play:function(){this.anim.play("chip_toss")}}),cc._RF.pop()},{}],Types:[function(t,e,i){"use strict";cc._RF.push(e,"5b633QMQxpFmYetofEvK2UD","Types");var n=cc.Enum({Spade:1,Heart:2,Club:3,Diamond:4}),o="NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K".split(",");function s(t,e){Object.defineProperties(this,{point:{value:t,writable:!1},suit:{value:e,writable:!1},id:{value:13*(e-1)+(t-1),writable:!1},pointName:{get:function(){return o[this.point]}},suitName:{get:function(){return n[this.suit]}},isBlackSuit:{get:function(){return this.suit===n.Spade||this.suit===n.Club}},isRedSuit:{get:function(){return this.suit===n.Heart||this.suit===n.Diamond}}})}s.prototype.toString=function(){return this.suitName+" "+this.pointName};var a=new Array(52);s.fromId=function(t){return a[t]},function(){for(var t=1;t<=4;t++)for(var e=1;e<=13;e++){var i=new s(e,t);a[i.id]=i}}();var r=cc.Enum({Normal:-1,Stand:-1,Report:-1,Bust:-1}),c=cc.Enum({Win:-1,Lose:-1,Tie:-1}),u=cc.Enum({Normal:-1,BlackJack:-1,FiveCard:-1});e.exports={Suit:n,Card:s,ActorPlayingState:r,Hand:u,Outcome:c},cc._RF.pop()},{}],Utils:[function(t,e,i){"use strict";cc._RF.push(e,"73590esk6xP9ICqhfUZalMg","Utils");e.exports={isBust:function(t){for(var e=0,i=0;i<t.length;i++){var n=t[i];e+=Math.min(10,n.point)}return 21<e},getMinMaxPoint:function(t){for(var e=!1,i=0,n=0;n<t.length;n++){var o=t[n];1===o.point&&(e=!0),i+=Math.min(10,o.point)}var s=i;return e&&i+10<=21&&(s+=10),{min:i,max:s}},isMobile:function(){return cc.sys.isMobile}},cc._RF.pop()},{}],"game-fsm":[function(t,e,i){"use strict";cc._RF.push(e,"6510d1SmQRMMYH8FEIA7zXq","game-fsm");var c,u,h,l=t("state.com");function p(e){return function(t){return t===e}}var n=!1;i={init:function(t){l.console=console,u=new l.StateMachine("root");var e=new l.PseudoState("init-root",u,l.PseudoStateKind.Initial),i=new l.State("下注",u);h=new l.State("已开局",u);var n=new l.State("结算",u);e.to(i),i.to(h).when(p("deal")),h.to(n).when(p("end")),n.to(i).when(p("bet")),i.entry(function(){t.onBetState(!0)}),i.exit(function(){t.onBetState(!1)}),n.entry(function(){t.onEndState(!0)}),n.exit(function(){t.onEndState(!1)});var o=new l.PseudoState("init 已开局",h,l.PseudoStateKind.Initial),s=new l.State("发牌",h),a=new l.State("玩家决策",h),r=new l.State("庄家决策",h);o.to(s),s.to(a).when(p("dealed")),a.to(r).when(p("player acted")),s.entry(function(){t.onEnterDealState()}),a.entry(function(){t.onPlayersTurnState(!0)}),a.exit(function(){t.onPlayersTurnState(!1)}),r.entry(function(){t.onEnterDealersTurnState()}),c=new l.StateMachineInstance("fsm"),l.initialise(u,c)},toDeal:function(){this._evaluate("deal")},toBet:function(){this._evaluate("bet")},onDealed:function(){this._evaluate("dealed")},onPlayerActed:function(){this._evaluate("player acted")},onDealerActed:function(){this._evaluate("end")},_evaluate:function(t){n?setTimeout(function(){l.evaluate(u,c,t)},1):(n=!0,l.evaluate(u,c,t),n=!1)},_getInstance:function(){return c},_getModel:function(){return u}},e.exports=i,cc._RF.pop()},{"state.com":"state.com"}],"state.com":[function(t,e,i){"use strict";var n,o,s,a;cc._RF.push(e,"71d9293mx9CFryhJvRw85ZS","state.com"),n=x||(x={}),o=function(){function e(t){this.actions=[],t&&this.push(t)}return e.prototype.push=function(t){return Array.prototype.push.apply(this.actions,t instanceof e?t.actions:arguments),this},e.prototype.hasActions=function(){return 0!==this.actions.length},e.prototype.invoke=function(e,i,n){void 0===n&&(n=!1),this.actions.forEach(function(t){return t(e,i,n)})},e}(),n.Behavior=o,function(t){var e;(e=t.PseudoStateKind||(t.PseudoStateKind={}))[e.Initial=0]="Initial",e[e.ShallowHistory=1]="ShallowHistory",e[e.DeepHistory=2]="DeepHistory",e[e.Choice=3]="Choice",e[e.Junction=4]="Junction",e[e.Terminate=5]="Terminate";t.PseudoStateKind}(x||(x={})),function(t){var e;(e=t.TransitionKind||(t.TransitionKind={}))[e.Internal=0]="Internal",e[e.Local=1]="Local",e[e.External=2]="External";t.TransitionKind}(x||(x={})),s=x||(x={}),a=function(){function i(t,e){this.name=t,this.qualifiedName=e?e.qualifiedName+i.namespaceSeparator+t:t}return i.prototype.toString=function(){return this.qualifiedName},i.namespaceSeparator=".",i}(),s.Element=a;var r,c,u,h,l,p,d,f,g,m,v,y,C,S,b,P,k,F,T,R,x,I=function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);function n(){this.constructor=t}n.prototype=e.prototype,t.prototype=new n};r=x||(x={}),c=function(i){function t(t,e){i.call(this,t,e),this.vertices=[],this.state=e,this.state.regions.push(this),this.state.getRoot().clean=!1}return I(t,i),t.prototype.getRoot=function(){return this.state.getRoot()},t.prototype.accept=function(t,e,i,n){return t.visitRegion(this,e,i,n)},t.defaultName="default",t}(r.Element),r.Region=c,u=x||(x={}),h=function(i){function t(t,e){i.call(this,t,e=e instanceof u.State?e.defaultRegion():e),this.outgoing=[],this.region=e,this.region&&(this.region.vertices.push(this),this.region.getRoot().clean=!1)}return I(t,i),t.prototype.getRoot=function(){return this.region.getRoot()},t.prototype.to=function(t,e){return void 0===e&&(e=u.TransitionKind.External),new u.Transition(this,t,e)},t.prototype.accept=function(t,e,i,n){},t}(u.Element),u.Vertex=h,l=x||(x={}),p=function(n){function t(t,e,i){void 0===i&&(i=l.PseudoStateKind.Initial),n.call(this,t,e),this.kind=i}return I(t,n),t.prototype.isHistory=function(){return this.kind===l.PseudoStateKind.DeepHistory||this.kind===l.PseudoStateKind.ShallowHistory},t.prototype.isInitial=function(){return this.kind===l.PseudoStateKind.Initial||this.isHistory()},t.prototype.accept=function(t,e,i,n){return t.visitPseudoState(this,e,i,n)},t}(l.Vertex),l.PseudoState=p,d=x||(x={}),f=function(i){function t(t,e){i.call(this,t,e),this.exitBehavior=new d.Behavior,this.entryBehavior=new d.Behavior,this.regions=[]}return I(t,i),t.prototype.defaultRegion=function(){return this.regions.reduce(function(t,e){return e.name===d.Region.defaultName?e:t},void 0)||new d.Region(d.Region.defaultName,this)},t.prototype.isFinal=function(){return 0===this.outgoing.length},t.prototype.isSimple=function(){return 0===this.regions.length},t.prototype.isComposite=function(){return 0<this.regions.length},t.prototype.isOrthogonal=function(){return 1<this.regions.length},t.prototype.exit=function(t){return this.exitBehavior.push(t),this.getRoot().clean=!1,this},t.prototype.entry=function(t){return this.entryBehavior.push(t),this.getRoot().clean=!1,this},t.prototype.accept=function(t,e,i,n){return t.visitState(this,e,i,n)},t}(d.Vertex),d.State=f,g=x||(x={}),m=function(i){function t(t,e){i.call(this,t,e)}return I(t,i),t.prototype.accept=function(t,e,i,n){return t.visitFinalState(this,e,i,n)},t}(g.State),g.FinalState=m,v=x||(x={}),y=function(e){function t(t){e.call(this,t,void 0),this.clean=!1}return I(t,e),t.prototype.getRoot=function(){return this.region?this.region.getRoot():this},t.prototype.accept=function(t,e,i,n){return t.visitStateMachine(this,e,i,n)},t}(v.State),v.StateMachine=y,C=x||(x={}),S=function(){function o(t,e,i){var n=this;void 0===i&&(i=C.TransitionKind.External),this.transitionBehavior=new C.Behavior,this.onTraverse=new C.Behavior,this.source=t,this.target=e,this.kind=e?i:C.TransitionKind.Internal,this.guard=t instanceof C.PseudoState?o.TrueGuard:function(t){return t===n.source},this.source.outgoing.push(this),this.source.getRoot().clean=!1}return o.prototype.else=function(){return this.guard=o.FalseGuard,this},o.prototype.when=function(t){return this.guard=t,this},o.prototype.effect=function(t){return this.transitionBehavior.push(t),this.source.getRoot().clean=!1,this},o.prototype.accept=function(t,e,i,n){return t.visitTransition(this,e,i,n)},o.prototype.toString=function(){return"["+(this.target?this.source+" -> "+this.target:this.source)+"]"},o.TrueGuard=function(){return!0},o.FalseGuard=function(){return!1},o}(),C.Transition=S,b=x||(x={}),P=function(){function t(){}return t.prototype.visitElement=function(t,e,i,n){},t.prototype.visitRegion=function(t,e,i,n){var o=this,s=this.visitElement(t,e,i,n);return t.vertices.forEach(function(t){t.accept(o,e,i,n)}),s},t.prototype.visitVertex=function(t,e,i,n){var o=this,s=this.visitElement(t,e,i,n);return t.outgoing.forEach(function(t){t.accept(o,e,i,n)}),s},t.prototype.visitPseudoState=function(t,e,i,n){return this.visitVertex(t,e,i,n)},t.prototype.visitState=function(t,e,i,n){var o=this,s=this.visitVertex(t,e,i,n);return t.regions.forEach(function(t){t.accept(o,e,i,n)}),s},t.prototype.visitFinalState=function(t,e,i,n){return this.visitState(t,e,i,n)},t.prototype.visitStateMachine=function(t,e,i,n){return this.visitState(t,e,i,n)},t.prototype.visitTransition=function(t,e,i,n){},t}(),b.Visitor=P,k=x||(x={}),F=function(){function t(t){void 0===t&&(t="unnamed"),this.last={},this.isTerminated=!1,this.name=t}return t.prototype.setCurrent=function(t,e){this.last[t.qualifiedName]=e},t.prototype.getCurrent=function(t){return this.last[t.qualifiedName]},t.prototype.toString=function(){return this.name},t}(),k.StateMachineInstance=F,function(t){t.setRandom=function(t){e=t},t.getRandom=function(){return e};var e=function(t){return Math.floor(Math.random()*t)}}(x||(x={})),(T=x||(x={})).isActive=function t(e,i){return e instanceof T.Region?t(e.state,i):e instanceof T.State?!e.region||t(e.region,i)&&i.getCurrent(e.region)===e:void 0},(R=x||(x={})).isComplete=function e(t,i){return t instanceof R.Region?i.getCurrent(t).isFinal():!(t instanceof R.State)||t.regions.every(function(t){return e(t,i)})},function(r){function o(t,e,i){void 0===i&&(i=!0),e?(i&&!1===t.clean&&o(t),r.console.log("initialise "+e),t.onInitialise.invoke(void 0,e)):(r.console.log("initialise "+t.name),t.accept(new n,!1),t.clean=!0)}function s(e,i,n){var o=!1;if(e.regions.every(function(t){return!s(i.getCurrent(t),i,n)||(o=!0,r.isActive(e,i))}),o)n!==e&&r.isComplete(e,i)&&s(e,i,e);else{var t=e.outgoing.filter(function(t){return t.guard(n,i)});1===t.length?o=a(t[0],i,n):1<t.length&&r.console.error(e+": multiple outbound transitions evaluated true for message "+n)}return o}function a(t,e,i){for(var n=new r.Behavior(t.onTraverse),o=t.target;o&&o instanceof r.PseudoState&&o.kind===r.PseudoStateKind.Junction;)o=(t=c(o,e,i)).target,n.push(t.onTraverse);return n.invoke(i,e),o&&o instanceof r.PseudoState&&o.kind===r.PseudoStateKind.Choice?a(c(o,e,i),e,i):o&&o instanceof r.State&&r.isComplete(o,e)&&s(o,e,o),!0}function c(t,e,i){var n=t.outgoing.filter(function(t){return t.guard(i,e)});return t.kind===r.PseudoStateKind.Choice?0!==n.length?n[r.getRandom()(n.length)]:u(t):1<n.length?void r.console.error("Multiple outbound transition guards returned true at "+this+" for "+i):n[0]||u(t)}function u(t){return t.outgoing.filter(function(t){return t.guard===r.Transition.FalseGuard})[0]}function h(t){return t[0]||(t[0]=new r.Behavior)}function l(t){return t[1]||(t[1]=new r.Behavior)}function p(t){return t[2]||(t[2]=new r.Behavior)}function d(t){return new r.Behavior(l(t)).push(p(t))}function f(t){return(t.region?f(t.region.state):[]).concat(t)}r.initialise=o,r.evaluate=function(t,e,i,n){return void 0===n&&(n=!0),r.console.log(e+" evaluate "+i),n&&!1===t.clean&&o(t),!e.isTerminated&&s(t,e,i)};var g=function(t){function e(){t.apply(this,arguments)}return I(e,t),e.prototype.visitTransition=function(t,e){t.kind===r.TransitionKind.Internal?t.onTraverse.push(t.transitionBehavior):t.kind===r.TransitionKind.Local?this.visitLocalTransition(t,e):this.visitExternalTransition(t,e)},e.prototype.visitLocalTransition=function(o,s){var a=this;o.onTraverse.push(function(e,i){for(var t=f(o.target),n=0;r.isActive(t[n],i);)++n;for(h(s(i.getCurrent(t[n].region))).invoke(e,i),o.transitionBehavior.invoke(e,i);n<t.length;)a.cascadeElementEntry(o,s,t[n++],t[n],function(t){t.invoke(e,i)});p(s(o.target)).invoke(e,i)})},e.prototype.visitExternalTransition=function(e,t){for(var i=f(e.source),n=f(e.target),o=Math.min(i.length,n.length)-1;i[o-1]!==n[o-1];)--o;for(e.onTraverse.push(h(t(i[o]))),e.onTraverse.push(e.transitionBehavior);o<n.length;)this.cascadeElementEntry(e,t,n[o++],n[o],function(t){return e.onTraverse.push(t)});e.onTraverse.push(p(t(e.target)))},e.prototype.cascadeElementEntry=function(t,e,i,n,o){o(l(e(i))),n&&i instanceof r.State&&i.regions.forEach(function(t){o(l(e(t))),t!==n.region&&o(p(e(t)))})},e}(r.Visitor),n=function(n){function t(){n.apply(this,arguments),this.behaviours={}}return I(t,n),t.prototype.behaviour=function(t){return this.behaviours[t.qualifiedName]||(this.behaviours[t.qualifiedName]=[])},t.prototype.visitElement=function(i,t){r.console!==e&&(h(this.behaviour(i)).push(function(t,e){return r.console.log(e+" leave "+i)}),l(this.behaviour(i)).push(function(t,e){return r.console.log(e+" enter "+i)}))},t.prototype.visitRegion=function(n,e){var o=this,s=n.vertices.reduce(function(t,e){return e instanceof r.PseudoState&&e.isInitial()?e:t},void 0);n.vertices.forEach(function(t){t.accept(o,e||s&&s.kind===r.PseudoStateKind.DeepHistory)}),h(this.behaviour(n)).push(function(t,e){return h(o.behaviour(e.getCurrent(n))).invoke(t,e)}),e||!s||s.isHistory()?p(this.behaviour(n)).push(function(t,e,i){d(o.behaviour((i||s.isHistory())&&e.getCurrent(n)||s)).invoke(t,e,i||s.kind===r.PseudoStateKind.DeepHistory)}):p(this.behaviour(n)).push(d(this.behaviour(s))),this.visitElement(n,e)},t.prototype.visitPseudoState=function(i,t){n.prototype.visitPseudoState.call(this,i,t),i.isInitial()?p(this.behaviour(i)).push(function(t,e){return a(i.outgoing[0],e)}):i.kind===r.PseudoStateKind.Terminate&&l(this.behaviour(i)).push(function(t,e){return e.isTerminated=!0})},t.prototype.visitState=function(i,e){var n=this;i.regions.forEach(function(t){t.accept(n,e),h(n.behaviour(i)).push(h(n.behaviour(t))),p(n.behaviour(i)).push(d(n.behaviour(t)))}),this.visitVertex(i,e),h(this.behaviour(i)).push(i.exitBehavior),l(this.behaviour(i)).push(i.entryBehavior),l(this.behaviour(i)).push(function(t,e){i.region&&e.setCurrent(i.region,i)})},t.prototype.visitStateMachine=function(t,e){var i=this;n.prototype.visitStateMachine.call(this,t,e),t.accept(new g,function(t){return i.behaviour(t)}),t.onInitialise=d(this.behaviour(t))},t}(r.Visitor),e={log:function(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i]},warn:function(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i]},error:function(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];throw t}};r.console=e}(x||(x={})),function(o){o.validate=function(t){t.accept(new e)};var e=function(n){function t(){n.apply(this,arguments)}return I(t,n),t.prototype.visitPseudoState=function(t){n.prototype.visitPseudoState.call(this,t),t.kind===o.PseudoStateKind.Choice||t.kind===o.PseudoStateKind.Junction?(0===t.outgoing.length&&o.console.error(t+": "+t.kind+" pseudo states must have at least one outgoing transition."),1<t.outgoing.filter(function(t){return t.guard===o.Transition.FalseGuard}).length&&o.console.error(t+": "+t.kind+" pseudo states cannot have more than one Else transitions.")):(0!==t.outgoing.filter(function(t){return t.guard===o.Transition.FalseGuard}).length&&o.console.error(t+": "+t.kind+" pseudo states cannot have Else transitions."),t.isInitial()&&(1!==t.outgoing.length?o.console.error(t+": initial pseudo states must have one outgoing transition."):t.outgoing[0].guard!==o.Transition.TrueGuard&&o.console.error(t+": initial pseudo states cannot have a guard condition.")))},t.prototype.visitRegion=function(e){var i;n.prototype.visitRegion.call(this,e),e.vertices.forEach(function(t){t instanceof o.PseudoState&&t.isInitial()&&(i&&o.console.error(e+": regions may have at most one initial pseudo state."),i=t)})},t.prototype.visitState=function(t){n.prototype.visitState.call(this,t),1<t.regions.filter(function(t){return t.name===o.Region.defaultName}).length&&o.console.error(t+": a state cannot have more than one region named "+o.Region.defaultName)},t.prototype.visitFinalState=function(t){n.prototype.visitFinalState.call(this,t),0!==t.outgoing.length&&o.console.error(t+": final states must not have outgoing transitions."),0!==t.regions.length&&o.console.error(t+": final states must not have child regions."),t.entryBehavior.hasActions()&&o.console.warn(t+": final states may not have entry behavior."),t.exitBehavior.hasActions()&&o.console.warn(t+": final states may not have exit behavior.")},t.prototype.visitTransition=function(t){n.prototype.visitTransition.call(this,t),t.kind===o.TransitionKind.Local&&-1===function t(e){return(e.region?t(e.region.state):[]).concat(e)}(t.target).indexOf(t.source)&&o.console.error(t+": local transition target vertices must be a child of the source composite sate.")},t}(o.Visitor)}(x||(x={})),e.exports=x,cc._RF.pop()},{}]},{},["Actor","ActorRenderer","AssetMng","AudioMng","Bet","Card","Dealer","FXPlayer","Game","Menu","Player","SideSwitcher","TossChip","ButtonScaler","InGameUI","ModalUI","RankItem","RankList","state.com","Decks","PlayerData","Types","Utils","game-fsm"]);