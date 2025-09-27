import unittest
import io
from app.api import app

class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.endpoint = '/analyze'

    def test_health_check(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertIn('status', response.json)
        self.assertEqual(response.json['status'], 'OK')

    def test_no_file(self):
        response = self.client.post(self.endpoint)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)

    def test_invalid_file(self):
        data = {
            'image': (io.BytesIO(b"fake image data"), 'test.txt')
        }
        response = self.client.post(self.endpoint, data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)

    def test_valid_image(self):
        # Replace 'tests/sample_images/sample_kolam1.jpg' with path to a real sample image here
        with open('tests/sample_images/sample10.png', 'rb') as img_file:
            data = {
                'image': (img_file, 'sample_kolam1.png')
            }
            response = self.client.post(self.endpoint, data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertIn('dots', response.json)
            self.assertIn('lines', response.json)
            self.assertIn('shapes', response.json)

if __name__ == '__main__':
    unittest.main()
