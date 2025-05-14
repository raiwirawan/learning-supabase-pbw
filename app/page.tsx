import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main className="home">
			<div className="container mx-auto p-50">
				<div className="w-full flex items-center justify-center">
					THIS IS HOME PAGE
				</div>
				<div>
					<Button variant="default">Click Me</Button>
				</div>
			</div>
		</main>
	);
}
