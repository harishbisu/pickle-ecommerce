import { Card, CardBody, Flex, Box, Text } from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon | any;
  color: string;
  bg: string;
  help: string;
}

export function StatCard({ label, value, icon: Icon, color, bg, help }: StatCardProps) {
  return (
    <Card>
      <CardBody p={5}>
        <Flex align="start" justify="space-between">
          <Box>
            <Text fontSize="12px" color="surface.500" fontWeight="500" mb={1}>{label}</Text>
            <Text fontSize="28px" fontWeight="800" color="surface.900" lineHeight={1}>{value}</Text>
            <Text fontSize="11px" color="surface.400" mt={1}>{help}</Text>
          </Box>
          <Box w="44px" h="44px" borderRadius="12px" bg={bg} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
            <Icon size={22} color={color} />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
}
