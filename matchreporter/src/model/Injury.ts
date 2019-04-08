export class Injury {
    public D68: number;
    // public result: string;
    // public effect: string;


    constructor (props: any) {
        // console.log('new casualty: ', props.D68);
        this.D68 = parseInt(props.D68);

        // this.result = this.getResult(this.D68);
        // this.effect = this.getEffect(this.D68);
    }
    public get type(): string {
        if (this.D68 < 60 && this.D68 >= 40) {
            return CasualtyType.SeriousInjury;
        } else if (this.D68 >= 60) {
            return CasualtyType.Kill;
        } else {
            return CasualtyType.BadlyHurt;
        }
    }
    public get effect(): string {
        if (this.D68 < 41) {
            return InjuryEffect.BH;
        } else if (this.D68 < 51) {
            return InjuryEffect.MNG;
        } else if (this.D68 < 53) {
            return InjuryEffect.NigglingInjury;
        } else if (this.D68 < 55) {
            return InjuryEffect.MovementBust;
        } else if (this.D68 < 57) {
            return InjuryEffect.ArmorBust;
        } else if (this.D68 === 57) {
            return InjuryEffect.AgilityBust;
        } else if (this.D68 < 60) {
            return InjuryEffect.StrengthBust;
        } else if (this.D68 >= 60 && this.D68 < 69) {
            return InjuryEffect.Dead;
        } else {
            return InjuryEffect.BH;
        }
    }
    public get result(): string {
        if (this.D68 < 41) {
            return InjuryDescription.BadlyHurt;
        } else if (this.D68 === 41) {
            return InjuryDescription.BrokenRibs;
        } else if (this.D68 === 42) {
            return InjuryDescription.GroinStrain;
        } else if (this.D68 === 43) {
            return InjuryDescription.GougedEye;
        } else if (this.D68 === 44) {
            return InjuryDescription.BrokenJaw;
        } else if (this.D68 === 45) {
            return InjuryDescription.FracturedArm;
        } else if (this.D68 === 46) {
            return InjuryDescription.FracturedLeg;
        } else if (this.D68 === 47) {
            return InjuryDescription.SmashedHand;
        } else if (this.D68 < 51) {
            return InjuryDescription.PinchedNerve;
        } else if (this.D68 === 51) {
            return InjuryDescription.DamagedBack;
        } else if (this.D68 === 52) {
            return InjuryDescription.SmashedKnee;
        } else if (this.D68 === 53) {
            return InjuryDescription.SmashedHip;
        } else if (this.D68 === 54) {
            return InjuryDescription.SmashedAnkle;
        } else if (this.D68 === 55) {
            return InjuryDescription.SeriousConcussion;
        } else if (this.D68 === 56) {
            return InjuryDescription.FracturedSkull;
        } else if (this.D68 === 57) {
            return InjuryDescription.BrokenNeck;
        } else if (this.D68 < 60) {
            return InjuryDescription.SmashedCollarBone;
        } else if (this.D68 >= 60 && this.D68 < 69) {
            return InjuryDescription.Dead;
        } else {
            return "-";
        }
    }
}

export enum InjuryDescription {
    BadlyHurt = "Badly Hurt",
    BrokenRibs = "Broken Ribs",
    GroinStrain = "Groin Strain",
    GougedEye = "Gouged Eye",
    BrokenJaw = "Broken Jaw",
    FracturedArm = "Fractured Arm",
    FracturedLeg = "Fractured Leg",
    SmashedHand = "Smashed Hand",
    PinchedNerve = "Pinched Nerve",
    DamagedBack = "Damaged Back",
    SmashedKnee = "Smashed Knee",
    SmashedHip = "Smashed Hip",
    SmashedAnkle = "Smashed Ankle",
    SeriousConcussion = "Serious Concussion",
    FracturedSkull = "Fractured Skull",
    BrokenNeck = "Broken Neck",
    SmashedCollarBone = "Smashed Collar Bone",
    Dead = "Dead",
}

export enum CasualtyType {
    BadlyHurt = "Badly Hurt",
    SeriousInjury = "Serious Injury",
    Kill = "Kill"
}

export enum InjuryType {
    BH = 0,
    MNG,
    NigglingInjury,
    StatDecrease,
    Dead
}

export enum InjuryEffect {
    BH = "No long term effect",
    MNG = "Miss next game",
    NigglingInjury = "Niggling Injury",
    MovementBust = "-1 MA",
    ArmorBust = "-1 AV",
    AgilityBust = "-1 AG",
    StrengthBust = "-1 ST",
    Dead = "Dead"
}
