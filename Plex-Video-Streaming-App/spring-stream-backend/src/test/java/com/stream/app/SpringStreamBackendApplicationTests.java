package com.stream.app;

import com.stream.app.services.VideoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SpringStreamBackendApplicationTests {
	@Autowired
	VideoService videoService;

	@Test
	void contextLoads() {
//		videoService.processVideo("06e802d4-2827-48c7-baf0-3bc46fd9db37");
	}

}
