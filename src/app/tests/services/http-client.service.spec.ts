import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { authInterceptor } from "../../shared/services/http-interceptor";
import { HttpClientService } from "../../shared/services/http-client.service";
import { first, firstValueFrom } from "rxjs";
import { AtomicStitch, AtomicStitchType, Color, Panel } from "../../shared/model/Chart";

describe('HttpClientService', () => {
    let httpTesting: HttpTestingController;
    let service: HttpClientService;

    const baseUrl = 'http://localhost:8080/api';

    // See: https://angular.dev/guide/http/testing#expecting-and-answering-requests

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [
            provideHttpClient(withInterceptors([ authInterceptor ])),
            provideHttpClientTesting()
        ]
        });
        httpTesting = TestBed.inject(HttpTestingController);
        service = TestBed.inject(HttpClientService);
    });

    afterEach(() => {
        httpTesting.verify();
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getCharts without specifying user', () => {
        firstValueFrom(service.getCharts());
        const req = httpTesting.expectOne(`${baseUrl}/charts`);
        expect(req.request.method).toBe('GET');
    });

    it('getCharts specifying user', () => {
        firstValueFrom(service.getCharts('user0'));
        const req = httpTesting.expectOne(`${baseUrl}/charts?userName=user0`);
        expect(req.request.method).toBe('GET');
    });

    it('getChartById', () => {
        firstValueFrom(service.getChartById(6));
        const req = httpTesting.expectOne(`${baseUrl}/charts/${6}`);
        expect(req.request.method).toBe('GET');
    });

    it('createChart', () => {
        const chart = {
            title: "",
            description: "",
            width: 0,
            height: 0,
            flat: false,
            pattern: [],
            colors: {
                MC: "#fff"
            },
            filePath: ""
        };
        firstValueFrom(service.createChart(chart));
        const req = httpTesting.expectOne(`${baseUrl}/charts`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(chart);
    });

    it('deleteChart', () => {
        firstValueFrom(service.deleteChart(6));
        const req = httpTesting.expectOne(`${baseUrl}/charts/${6}`);
        expect(req.request.method).toBe('DELETE');
    });

    it('getPanels without specifying user', () => {
        firstValueFrom(service.getPanels());
        const req = httpTesting.expectOne(`${baseUrl}/panels`);
        expect(req.request.method).toBe('GET');
    });

    it('getPanels specifying user', () => {
        firstValueFrom(service.getPanels('user1'));
        const req = httpTesting.expectOne(`${baseUrl}/panels?userName=user1`);
        expect(req.request.method).toBe('GET');
    });

    it('getPanelById', () => {
        firstValueFrom(service.getPanelById(7));
        const req = httpTesting.expectOne(`${baseUrl}/panels/${7}`);
        expect(req.request.method).toBe('GET');
    });

    it('createPanel', () => {
        const panel: Panel = {
            title: "Panel",
            description: "",
            width: 1,
            height: 1,
            flat: false,
            pattern: [
                [
                    new AtomicStitch(Color.MC, AtomicStitchType.Knit)
                ]
            ],
            colors: {
                MC: "#fefefe"
            },
            filePath: "",
            charts: [
                {
                    title: "Chart",
                    description: "",
                    width: 1,
                    height: 1,
                    flat: false,
                    pattern: [
                        [
                            new AtomicStitch(Color.MC, AtomicStitchType.Knit)
                        ]
                    ],
                    colors: {
                        MC: "#fefefe"
                    },
                    filePath: ""
                }
            ]
        };
        firstValueFrom(service.createPanel(panel));
        const req = httpTesting.expectOne(`${baseUrl}/panels`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(panel);
    });

    it('deletePanel', () => {
        firstValueFrom(service.deletePanel(8));
        const req = httpTesting.expectOne(`${baseUrl}/panels/${8}`);
        expect(req.request.method).toBe('DELETE');
    });

    it('login', () => {
        const authRequest = {
            username: "user9",
            password: "password9"
        };
        firstValueFrom(service.login(authRequest));
        const req = httpTesting.expectOne(`${baseUrl}/login`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(authRequest);
    });

    it('register', () => {
        const authRequest = {
            username: "user10",
            password: "password10"
        };
        firstValueFrom(service.register(authRequest));
        const req = httpTesting.expectOne(`${baseUrl}/register`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(authRequest);
    });

    it('getUser', () => {
        firstValueFrom(service.getUser("user11"));
        const req = httpTesting.expectOne(`${baseUrl}/users/user11`);
        expect(req.request.method).toBe('GET');
    });

    it('addFavorite', () => {
        firstValueFrom(service.addFavorite(12));
        const req = httpTesting.expectOne(`${baseUrl}/users/favorites/${12}`);
        expect(req.request.method).toBe('POST');
    });

    it('deleteFavorite', () => {
        firstValueFrom(service.removeFavorite(14));
        const req = httpTesting.expectOne(`${baseUrl}/users/favorites/${14}`);
        expect(req.request.method).toBe('DELETE');
    });

    it('uploadImage', () => {
        const file = new File([], "image.png", {
            type: "image/png"
        });
        firstValueFrom(service.uploadImage(file));
        const req = httpTesting.expectOne(`${baseUrl}/images`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body instanceof FormData).toBeTrue();
        expect((req.request.body as FormData).get("file")).toEqual(file);
    });

    it('getImage', () => {
        firstValueFrom(service.getImage("image.png"));
        const req = httpTesting.expectOne(`${baseUrl}/images/image.png`);
        expect(req.request.method).toBe('GET');
    });
});