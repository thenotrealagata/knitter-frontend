import { TestBed } from '@angular/core/testing';
import { FormService } from '../../shared/services/form.service';
import { AtomicStitch, AtomicStitchType, CableNeedleDirection, Chart, Color } from '../../shared/model/Chart';

describe('FormService', () => {
    let service: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Chart and panel form
    it('chartForm with all chart data', () => {
        const form = service.chartForm({
            title: "title",
            description: "description",
            width: 5,
            height: 5,
            pattern: [],
            flat: true,
            filePath: "/image.png"
        })

        expect(form.controls.title.value).toBe("title");
        expect(form.controls.description.value).toBe("description");
        expect(form.controls.width.value).toBe(5);
        expect(form.controls.height.value).toBe(5);
        expect(form.controls.pattern.value).toEqual([]);
        expect(form.controls.isFlat.value).toBeTrue();
        expect(form.controls.image.value).toBe("/image.png");
    });

    it('chartForm with partial chart', () => {
        const form = service.chartForm({
            width: 25,
            height: 30,
            pattern: [],
            flat: false
        })

        expect(form.controls.width.value).toBe(25);
        expect(form.controls.height.value).toBe(30);
        expect(form.controls.pattern.value).toEqual([]);
        expect(form.controls.isFlat.value).toBeFalse();

        expect(form.controls.title.value).toBe("");
        expect(form.controls.description.value).toBe("");
        expect(form.controls.image.value).toBe("");
    });

    it('formToChart copies form values', () => {
        const pattern = [ [ new AtomicStitch(Color.MC, AtomicStitchType.Knit) ]];
        const form = service.chartForm({
            title: 'title',
            description: 'description',
            width: 1,
            height: 1,
            flat: false,
            pattern: pattern,
            filePath: ''
        });
        const colorForm = service.colorPaletteForm({
            MC: "#fff",
            CC1: "#fefefe"
        });
        const converted = service.formToChart(form, colorForm, 12);

        expect(converted.title).toBe('title');
        expect(converted.description).toBe('description');
        expect(converted.height).toBe(1);
        expect(converted.width).toBe(1);
        expect(converted.pattern).toEqual(pattern);
        expect(converted.colors).toEqual({
            MC: "#fff",
            CC1: "#fefefe"
        });
        expect(converted.flat).toBeFalse();
        expect(converted.filePath).toBe("");
    });

    // Cable stitch form
    it('formToCableStitch copies form values', () => {
        const form = service.cableStitchForm();
        form.controls.stitchNumber.setValue(4);
        form.controls.sequence.setValue([AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Purl]);
        form.controls.holdCableNeedle.setValue(CableNeedleDirection.HOLD_BEHIND_WORK);
        form.controls.toCableNeedle.setValue(1);

        const cable = service.formToCableStitch(form, Color.CC2);
        expect(cable.color).toBe(Color.CC2);
        expect(cable.sequence).toEqual([AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Purl]);
        expect(cable.holdCableNeedle).toBe(CableNeedleDirection.HOLD_BEHIND_WORK);
        expect(cable.toCableNeedle).toBe(1);
    });

    // Color palette form
    it('colorPaletteForm from partial ColorPalette', () => {
        const form = service.colorPaletteForm({
            [Color.MC]: "#fff",
            [Color.CC1]: "#fff"
        })
        expect(form.contains("MC")).toBeTrue();
        expect(form.contains("CC1")).toBeTrue();
        expect(form.contains("CC3")).toBeFalse();
        expect(form.contains("CC4")).toBeFalse();
        expect(form.contains("CC5")).toBeFalse();
    });

    it('colorPaletteForm with all colors', () => {
        const form = service.colorPaletteForm({
            [Color.MC]: "#fff",
            [Color.CC1]: "#fff",
            [Color.CC2]: "#fff",
            [Color.CC3]: "#fff",
            [Color.CC4]: "#fff"
        })
        expect(Object.keys(form.controls).length).toBe(5);
    });

    it('colorPaletteForm without arguments', () => {
        const form = service.colorPaletteForm();
        expect(form.contains("MC")).toBeTrue();
        expect(Object.keys(form.controls).length).toBe(1);
    });

    // Auth request form
    it('formToAuthRequest copies form values', () => {
        const form = service.authenticationForm();
        form.controls.username.setValue("new_user");
        form.controls.password.setValue("new_password");

        const converted = service.formToAuthRequest(form);
        expect(converted.username).toBe("new_user");
        expect(converted.password).toBe("new_password");
    });
});