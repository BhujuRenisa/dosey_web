const Medicine = require('../models/medicine');
const { addMedicine, getMedicines } = require('../controller/medicineController');

jest.mock('../models/medicine');

describe("Medicine Controller", () => {

  // Mock Response Object
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
  };

  // Add Medicine Success Test
  test("should add medicine successfully", async () => {
    const req = {
      body: {
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "2 times",
        time: "08:00"
      },
      user: { id: 1 }
    };

    const res = mockResponse();

    Medicine.create.mockResolvedValue(req.body);

    await addMedicine(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  // Get Medicines Success Test
  test("should fetch medicines for user", async () => {
    const req = {
      user: { id: 1 }
    };

    const res = mockResponse();

    Medicine.findAll.mockResolvedValue([]);

    await getMedicines(req, res);

    expect(res.json).toHaveBeenCalled();
  });

});