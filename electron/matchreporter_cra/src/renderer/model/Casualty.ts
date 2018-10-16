export class Casualty {
    public D68: number;
    public result: string;
    public effect: string;


    constructor (props: any) {
        // console.log('new casualty: ', props.D68);
        this.D68 = props.D68;

        this.result = this.getResult(this.D68);
        this.effect = this.getEffect(this.D68);
    }
    private getEffect(D68: number): string {
        if (D68 < 51) {
            return InjuryDescription.MNG;
        } else if (D68 < 53) {
            return InjuryDescription.NigglingInjury;
        } else if (D68 < 55) {
            return InjuryDescription.MovementBust;
        } else if (D68 < 57) {
            return InjuryDescription.ArmorBust;
        } else if (D68 === 57) {
            return InjuryDescription.AgilityBust;
        } else if (D68 < 60) {
            return InjuryDescription.StrengthBust;
        } else if (D68 > 60) {
            return InjuryDescription.Dead;
        } else {
            return InjuryDescription.BH;
        }
    }
    private getResult(D68: number): string {
       if (D68 === 41) {
            return CasualtyResult.BrokenRibs;
        } else if (D68 === 42) {
            return CasualtyResult.GroinStrain;
        } else if (D68 === 43) {
            return CasualtyResult.GougedEye;
        } else if (D68 === 44) {
            return CasualtyResult.BrokenJaw;
        } else if (D68 === 45) {
            return CasualtyResult.FracturedArm;
        } else if (D68 === 46) {
            return CasualtyResult.FracturedLeg;
        } else if (D68 === 47) {
            return CasualtyResult.SmashedHand;
        } else if (D68 < 51) {
            return CasualtyResult.PinchedNerve;
        } else if (D68 === 51) {
            return CasualtyResult.DamagedBack;
        } else if (D68 === 52) {
            return CasualtyResult.SmashedKnee;
        } else if (D68 === 53) {
            return CasualtyResult.SmashedHip;
        } else if (D68 === 54) {
            return CasualtyResult.SmashedAnkle;
        } else if (D68 === 55) {
            return CasualtyResult.SeriousConcussion;
        } else if (D68 === 56) {
            return CasualtyResult.FracturedSkull;
        } else if (D68 === 57) {
            return CasualtyResult.BrokenNeck;
        } else if (D68 < 61) {
            return CasualtyResult.SmashedCollarBone;
        } else if (D68 > 60) {
            return CasualtyResult.Dead;
        } else {
            return CasualtyResult.BadlyHurt;
        }
    }
}

export enum CasualtyResult {
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

export enum InjuryDescription {
    BH = "No long term effect",
    MNG = "Miss next game",
    NigglingInjury = "Niggling Injury",
    MovementBust = "-1 MA",
    ArmorBust = "-1 AV",
    AgilityBust = "-1 AG",
    StrengthBust = "-1 ST",
    Dead = "Dead"
}
